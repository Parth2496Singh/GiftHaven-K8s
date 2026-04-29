import { Link, Navigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist-context";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/format";

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, loading, remove } = useWishlist();
  const { addItem } = useCart();

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">My Wishlist</h1>
        <p className="text-muted-foreground mb-8">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-serif font-bold">Your wishlist is empty</h2>
            <p className="text-muted-foreground">Tap the heart on any product to save it here.</p>
            <Button asChild className="rounded-full bg-gradient-gift text-primary-foreground">
              <Link to="/">Browse Gifts</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <div key={item.product_id} className="group bg-card rounded-xl border border-border overflow-hidden">
                <Link to={`/product/${item.product_id}`} className="block relative aspect-square bg-secondary">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </Link>
                <div className="p-4 space-y-2">
                  {item.category && <p className="text-xs text-muted-foreground">{item.category}</p>}
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-lg font-bold">{formatINR(Number(item.price))}</p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1 rounded-full"
                      onClick={() => addItem({ id: item.product_id, name: item.name, price: Number(item.price), image: item.image || "" })}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-9 w-9 p-0"
                      onClick={() => remove(item.product_id)}
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
