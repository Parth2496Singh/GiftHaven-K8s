import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export interface WishlistItem {
  product_id: number;
  name: string;
  price: number;
  image: string | null;
  category: string | null;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  ids: Set<number>;
  toggle: (item: WishlistItem) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlist")
      .select("product_id, name, price, image, category")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setItems((data as any) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const ids = new Set(items.map((i) => i.product_id));

  const toggle = async (item: WishlistItem) => {
    if (!user) {
      toast.error("Please sign in to use wishlist");
      return;
    }
    if (ids.has(item.product_id)) {
      await remove(item.product_id);
    } else {
      const { error } = await supabase.from("wishlist").insert({
        user_id: user.id,
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setItems((prev) => [item, ...prev]);
      toast.success("Added to wishlist");
    }
  };

  const remove = async (productId: number) => {
    if (!user) return;
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productId: number) => ids.has(productId);

  return (
    <WishlistContext.Provider value={{ items, loading, ids, toggle, remove, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
