import { useEffect, useState } from "react";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { products as catalog } from "@/lib/products";
import { formatINR } from "@/lib/format";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface UpsellResult {
  tagline: string;
  suggestions: { productId: number; reason: string }[];
}

const ContextualUpsell = ({ triggerItemId }: { triggerItemId: number | null }) => {
  const [result, setResult] = useState<UpsellResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (triggerItemId == null) { setResult(null); return; }
    const item = catalog.find((p) => p.id === triggerItemId);
    if (!item) return;
    let cancelled = false;
    setLoading(true);
    setResult(null);
    (async () => {
      try {
        const slim = catalog.map((p) => ({ id: p.id, name: p.name, price: p.price, category: p.category }));
        const res = await fetch(`${SUPABASE_URL}/functions/v1/upsell-suggest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addedItem: item, products: slim }),
        });
        if (!res.ok) throw new Error("Upsell failed");
        const data = await res.json();
        if (!cancelled) setResult(data);
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [triggerItemId]);

  if (!triggerItemId) return null;
  if (loading) {
    return (
      <Card className="p-4 mb-4 border-primary/30 bg-primary/5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Finding perfect pairings…
        </div>
      </Card>
    );
  }
  if (!result?.suggestions?.length) return null;

  return (
    <Card className="p-4 mb-4 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">{result.tagline || "People also buy this with…"}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {result.suggestions.map((s) => {
          const p = catalog.find((c) => c.id === s.productId);
          if (!p) return null;
          return (
            <div key={s.productId} className="bg-card rounded-lg border p-2 flex gap-2">
              <img src={p.image} alt={p.name} className="h-14 w-14 rounded object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium line-clamp-1">{p.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.reason}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-primary">{formatINR(p.price)}</span>
                  <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => {
                    addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
                    toast({ title: "Added 🎁", description: p.name });
                  }}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ContextualUpsell;
