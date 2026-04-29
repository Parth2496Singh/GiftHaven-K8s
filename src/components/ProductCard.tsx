import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/products";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const liked = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-gift transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&h=600&q=80";
          }}
        />
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">{product.badge}</Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs">-{discount}%</Badge>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle({ product_id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
          }}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
            liked ? "bg-primary text-primary-foreground opacity-100" : "bg-card/90 opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        </button>
      </Link>
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground text-sm leading-tight hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
            )}
          </div>
          <Button
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
