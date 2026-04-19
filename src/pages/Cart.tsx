import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, Gift, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/format";

const Cart = () => {
  const { items, updateQuantity, removeItem, toggleGiftWrap, setMessage, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-serif font-bold text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground">Find the perfect gift for your loved ones</p>
          <Button asChild className="rounded-full bg-gradient-gift text-primary-foreground">
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
        </Link>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-foreground">{formatINR(item.price * item.quantity)}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-full">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 flex items-center justify-center hover:bg-secondary rounded-l-full">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 flex items-center justify-center hover:bg-secondary rounded-r-full">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button onClick={() => toggleGiftWrap(item.id)} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${item.giftWrap ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary"}`}>
                      <Gift className="h-3 w-3" /> {item.giftWrap ? "Wrapped" : "Add wrap"}
                    </button>
                  </div>
                  {item.giftWrap && (
                    <input
                      type="text"
                      placeholder="Personal message..."
                      value={item.message || ""}
                      onChange={(e) => setMessage(item.id, e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl border border-border p-6 h-fit space-y-4 sticky top-24">
            <h3 className="font-serif font-bold text-lg text-foreground">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span>{totalPrice > 999 ? "Free" : formatINR(99)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground text-base">
                <span>Total</span><span>{formatINR(totalPrice + (totalPrice > 999 ? 0 : 99))}</span>
              </div>
            </div>
            <input type="text" placeholder="Coupon code" className="w-full p-3 rounded-lg bg-secondary text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <Button className="w-full rounded-full bg-gradient-gift text-primary-foreground hover:opacity-90" size="lg">
              Proceed to Checkout
            </Button>
            <p className="text-xs text-center text-muted-foreground">Secure checkout · Free returns</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
