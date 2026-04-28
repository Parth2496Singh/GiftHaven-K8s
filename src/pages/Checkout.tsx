import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatINR } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const addressSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone"),
  address_line1: z.string().trim().min(5, "Address is required").max(200),
  address_line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (!authLoading && !user) return <Navigate to="/auth" replace />;
  if (items.length === 0 && !submitting) return <Navigate to="/cart" replace />;

  const shipping = totalPrice > 999 ? 0 : 99;
  const giftWrapTotal = items.reduce((s, i) => s + (i.giftWrap ? 99 * i.quantity : 0), 0);
  const total = totalPrice + shipping;

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handlePlaceOrder = async () => {
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          subtotal: totalPrice - giftWrapTotal,
          shipping,
          total,
          payment_method: paymentMethod,
          ...parsed.data,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        gift_wrap: !!i.giftWrap,
        message: i.message ?? null,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to place order");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-serif font-bold text-lg">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="10-digit mobile" />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="6-digit" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address_line1">Address Line 1</Label>
                  <Input id="address_line1" value={form.address_line1} onChange={(e) => update("address_line1", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address_line2">Address Line 2 (optional)</Label>
                  <Input id="address_line2" value={form.address_line2} onChange={(e) => update("address_line2", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-serif font-bold text-lg">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border opacity-60">
                  <RadioGroupItem value="upi" id="upi" disabled />
                  <Label htmlFor="upi" className="flex-1">UPI / Card (coming soon)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 h-fit space-y-4 sticky top-24">
            <h3 className="font-serif font-bold text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate pr-2">{i.name} × {i.quantity}</span>
                  <span className="shrink-0">{formatINR(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                <span>Total</span><span>{formatINR(total)}</span>
              </div>
            </div>
            <Button onClick={handlePlaceOrder} disabled={submitting} className="w-full rounded-full bg-gradient-gift text-primary-foreground" size="lg">
              {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Placing...</> : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
