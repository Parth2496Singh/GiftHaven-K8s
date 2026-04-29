import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Gift, Truck, ArrowLeft, Minus, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";
import ProductReviews from "@/components/ProductReviews";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { formatINR } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const { addItem, clearCart } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [message, setMessage] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground">Product not found</h1>
          <Link to="/" className="text-primary mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const liked = isInWishlist(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image, giftWrap, message });
    }
    toast({ title: "Added to cart!", description: `${product.name} × ${qty}` });
  };

  const handleBuyNow = () => {
    clearCart();
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image, giftWrap, message });
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to shop
        </Link>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative rounded-2xl overflow-hidden bg-secondary aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" width={600} height={600} />
            {product.badge && <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{product.badge}</Badge>}
          </div>
          <div className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-1">{product.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">Save {discount}%</Badge>
                </>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <div className="space-y-3 p-4 bg-secondary rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={giftWrap} onChange={() => setGiftWrap(!giftWrap)} className="rounded border-border text-primary focus:ring-primary" />
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Add gift wrapping (+₹99)</span>
              </label>
              {giftWrap && (
                <textarea
                  placeholder="Add a personal message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  rows={2}
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 flex items-center justify-center hover:bg-secondary rounded-l-full transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-10 w-10 flex items-center justify-center hover:bg-secondary rounded-r-full transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} size="lg" variant="outline" className="flex-1 rounded-full">
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full h-12 w-12 p-0 ${liked ? "text-primary border-primary" : ""}`}
                onClick={() => toggle({ product_id: product.id, name: product.name, price: product.price, image: product.image, category: product.category })}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              </Button>
            </div>
            <Button onClick={handleBuyNow} size="lg" className="w-full rounded-full bg-gradient-gift text-primary-foreground hover:opacity-90">
              <Zap className="h-4 w-4 mr-2" /> Buy Now
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" /> Free shipping on orders over ₹999
            </div>
          </div>
        </div>
      </div>
      <ProductReviews productId={product.id} />
      {related.length > 0 && <ProductSection title="You May Also Like" products={related} />}
      <Footer />
    </div>
  );
};

export default ProductDetail;
