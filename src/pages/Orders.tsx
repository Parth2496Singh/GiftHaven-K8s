import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";

interface OrderItem {
  id: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  gift_wrap: boolean;
}
interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  city: string;
  pincode: string;
  payment_method: string;
  order_items: OrderItem[];
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  shipped: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
  delivered: "bg-green-500/20 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/20 text-red-700 dark:text-red-400",
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id, status, total, created_at, city, pincode, payment_method, order_items(id, name, image, price, quantity, gift_wrap)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setOrders((data as any) || []);
        setLoading(false);
      });
  }, [user]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Package className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-serif font-bold">No orders yet</h2>
            <p className="text-muted-foreground">Find something special to gift</p>
            <Button asChild className="rounded-full bg-gradient-gift text-primary-foreground">
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm">{o.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Placed on</p>
                    <p className="text-sm">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold">{formatINR(Number(o.total))}</p>
                  </div>
                  <Badge className={statusColor[o.status] || "bg-secondary"}>{o.status}</Badge>
                </div>
                <div className="border-t border-border pt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {o.order_items?.map((it) => (
                    <div key={it.id} className="flex gap-3">
                      {it.image && <img src={it.image} alt={it.name} className="w-14 h-14 rounded-lg object-cover" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{it.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {it.quantity} · {formatINR(Number(it.price))}</p>
                        {it.gift_wrap && <p className="text-xs text-primary">🎁 Gift wrapped</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Shipping to {o.city} · {o.pincode} · Payment: {o.payment_method.toUpperCase()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
