import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import OffersStrip from "@/components/OffersStrip";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { products } from "@/lib/products";
import { formatINR } from "@/lib/format";

const categoryMap: Record<string, string> = {
  "birthday-gifts": "Birthday Gifts",
  "anniversary-gifts": "Anniversary Gifts",
  "gifts-for-him": "Gifts for Him",
  "gifts-for-her": "Gifts for Her",
  "kids-gifts": "Kids Gifts",
  "corporate-gifts": "Corporate Gifts",
};

const RECIPIENTS = ["Him", "Her", "Kids", "Anyone"] as const;
const PRICE_MIN = 0;
const PRICE_MAX = 7000;

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "discount";

interface FiltersProps {
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  recipients: string[];
  toggleRecipient: (r: string) => void;
  minRating: number;
  setMinRating: (n: number) => void;
  onlyDiscount: boolean;
  setOnlyDiscount: (b: boolean) => void;
  reset: () => void;
}

const FiltersPanel = ({ price, setPrice, recipients, toggleRecipient, minRating, setMinRating, onlyDiscount, setOnlyDiscount, reset }: FiltersProps) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="font-serif font-bold text-lg text-foreground">Filters</h3>
      <button onClick={reset} className="text-xs text-primary hover:underline">Clear all</button>
    </div>

    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground">Price range</Label>
      <Slider
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={100}
        value={price}
        onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatINR(price[0])}</span>
        <span>{formatINR(price[1])}</span>
      </div>
    </div>

    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground">Recipient</Label>
      <div className="space-y-2">
        {RECIPIENTS.map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={recipients.includes(r)}
              onCheckedChange={() => toggleRecipient(r)}
              id={`recipient-${r}`}
            />
            <span className="text-sm text-foreground">For {r}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground">Minimum rating</Label>
      <div className="flex flex-wrap gap-2">
        {[0, 4, 4.5, 4.7].map((r) => (
          <button
            key={r}
            onClick={() => setMinRating(r)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              minRating === r
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary"
            }`}
          >
            {r === 0 ? "Any" : `${r}★ & up`}
          </button>
        ))}
      </div>
    </div>

    <label className="flex items-center gap-2 cursor-pointer">
      <Checkbox checked={onlyDiscount} onCheckedChange={(v) => setOnlyDiscount(!!v)} id="discount-only" />
      <span className="text-sm text-foreground">On sale only</span>
    </label>
  </div>
);

const CategoryPage = () => {
  const { slug } = useParams();
  const categoryName = categoryMap[slug || ""] || "All Gifts";
  const base = useMemo(
    () => (slug && categoryMap[slug] ? products.filter((p) => p.category === categoryName) : products),
    [slug, categoryName]
  );

  const [price, setPrice] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");

  const toggleRecipient = (r: string) =>
    setRecipients((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const reset = () => {
    setPrice([PRICE_MIN, PRICE_MAX]);
    setRecipients([]);
    setMinRating(0);
    setOnlyDiscount(false);
  };

  const filtered = useMemo(() => {
    let list = base.filter(
      (p) =>
        p.price >= price[0] &&
        p.price <= price[1] &&
        (recipients.length === 0 || recipients.includes(p.recipientType)) &&
        p.rating >= minRating &&
        (!onlyDiscount || !!p.originalPrice)
    );
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list = [...list].sort((a, b) => {
          const da = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const db = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return db - da;
        });
        break;
    }
    return list;
  }, [base, price, recipients, minRating, onlyDiscount, sort]);

  const activeCount =
    (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX ? 1 : 0) +
    recipients.length +
    (minRating > 0 ? 1 : 0) +
    (onlyDiscount ? 1 : 0);

  const filterProps: FiltersProps = {
    price, setPrice, recipients, toggleRecipient, minRating, setMinRating, onlyDiscount, setOnlyDiscount, reset,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OffersStrip />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">{categoryName}</h1>
        <p className="text-muted-foreground mb-6">{filtered.length} gifts found</p>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block bg-card border border-border rounded-xl p-5 h-fit sticky top-24">
            <FiltersPanel {...filterProps} />
          </aside>

          <div>
            {/* Mobile filter + sort bar */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden rounded-full gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters {activeCount > 0 && <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">{activeCount}</span>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[340px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-serif">Refine</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersPanel {...filterProps} />
                  </div>
                </SheetContent>
              </Sheet>

              {activeCount > 0 && (
                <button
                  onClick={reset}
                  className="hidden lg:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                >
                  <X className="h-3 w-3" /> Clear filters
                </button>
              )}

              <div className="ml-auto">
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="discount">Biggest Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card border border-border rounded-xl">
                <p className="text-muted-foreground">No gifts match your filters.</p>
                <Button onClick={reset} variant="outline" className="mt-4 rounded-full">
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
