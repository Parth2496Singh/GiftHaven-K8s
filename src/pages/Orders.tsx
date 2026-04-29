import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Package, Loader2, ArrowLeft, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderTracking from "@/components/OrderTracking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

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
  tracking_number: string | null;
  courier: string | null;
  cancelled_at: string | null;
  order_items: OrderItem[];
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  shipped: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
  delivered: "bg-green-500/20 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/20 text-red-700 dark:text-red-400",
};

const CANCELLABLE = new Set(["pending", "confirmed"]);

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const load = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, created_at, city, pincode, payment_method, tracking_number, courier, cancelled_at, order_items(id, name, image, price, quantity, gift_wrap)")
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) console.error(error);
      else setOrders((data as any) || []);
      setLoading(false);
    };
    load();

    // Realtime subscription for live order updates
    const channel = supabase
      .channel(`orders-${user.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` }, (payload) => {
        const updated = payload.new as Order;
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
        toast.info(`Order #${updated.id.slice(0, 8).toUpperCase()} → ${updated.status}`);
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString(), cancellation_reason: "Cancelled by customer" })
      .eq("id", orderId);
    setCancelling(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled", cancelled_at: new Date().toISOString() } : o)));
    toast.success("Order cancelled");
  };

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

                <OrderTracking status={o.status} />

                {o.tracking_number && o.status !== "cancelled" && (
                  <p className="text-xs text-muted-foreground">
                    Tracking: <span className="font-mono text-foreground">{o.tracking_number}</span>
                    {o.courier && ` · ${o.courier}`}
                  </p>
                )}

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

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-muted-foreground">Shipping to {o.city} · {o.pincode} · Payment: {o.payment_method.toUpperCase()}</p>
                  {CANCELLABLE.has(o.status) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" disabled={cancelling === o.id}>
                          {cancelling === o.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5 mr-1" />}
                          Cancel Order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your order #{o.id.slice(0, 8).toUpperCase()} will be cancelled. This cannot be undone.
                            Refunds (if applicable) will be processed in 5–7 business days.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Order</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCancel(o.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
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

export default Orders;
