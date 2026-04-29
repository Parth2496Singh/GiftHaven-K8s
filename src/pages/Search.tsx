import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { products, categories } from "@/lib/products";
import { formatINR } from "@/lib/format";

const PRICE_MAX = 7000;
type SortKey = "relevance" | "price-asc" | "price-desc" | "rating";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState<string>("all");
  const [price, setPrice] = useState<[number, number]>([0, PRICE_MAX]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>("relevance");

  const results = useMemo(() => {
    const term = (params.get("q") || "").trim().toLowerCase();
    let list = products.filter((p) => {
      const hay = `${p.name} ${p.category} ${p.recipientType} ${p.occasion} ${p.description}`.toLowerCase();
      return !term || hay.includes(term);
    });
    if (category !== "all") list = list.filter((p) => p.category === category);
    list = list.filter((p) => p.price >= price[0] && p.price <= price[1] && p.rating >= minRating);
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [params, category, price, minRating, sort]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(q ? { q } : {});
  };

  const Filters = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c.slug} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <Label>Price range</Label>
        <Slider min={0} max={PRICE_MAX} step={100} value={price} onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatINR(price[0])}</span><span>{formatINR(price[1])}</span>
        </div>
      </div>
      <div className="space-y-3">
        <Label>Minimum rating</Label>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.7].map((r) => (
            <button key={r} onClick={() => setMinRating(r)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                minRating === r ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary"
              }`}>
              {r === 0 ? "Any" : `${r}★ & up`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>

        <form onSubmit={submit} className="relative max-w-2xl mb-8">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gifts..." className="pl-10 pr-24 rounded-full h-11" />
          <Button type="submit" size="sm" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full">Search</Button>
        </form>

        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <h1 className="text-2xl font-serif font-bold">
            {params.get("q") ? <>Results for "<span className="text-primary">{params.get("q")}</span>"</> : "All Products"}
            <span className="text-sm font-normal text-muted-foreground ml-2">({results.length})</span>
          </h1>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden rounded-full gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><Filters /></div>
              </SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-[180px] rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="hidden lg:block bg-card border border-border rounded-xl p-5 h-fit sticky top-24">
            <Filters />
          </aside>
          <div>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {results.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-card border border-border rounded-xl">
                <p className="text-muted-foreground">No gifts match your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
