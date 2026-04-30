import { useState } from "react";
import { Sparkles, Loader2, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { products as catalog } from "@/lib/products";
import { formatINR } from "@/lib/format";
import { Link } from "react-router-dom";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface KitGroup {
  name: string;
  items: { productId: number; reason: string }[];
}

const EXAMPLES = [
  "I'm going to Goa for a bachelor party, build me a kit",
  "Build a romantic anniversary kit under ₹5000",
  "Corporate Diwali gifting kit for 5 clients",
  "Birthday surprise kit for my 8-year-old nephew",
];

const KitBuilder = () => {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<KitGroup[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();

  const build = async (text?: string) => {
    const g = (text ?? goal).trim();
    if (!g || loading) return;
    setGoal(g);
    setLoading(true);
    setGroups([]);

    try {
      const slim = catalog.map((p) => ({
        id: p.id, name: p.name, price: p.price, category: p.category,
        occasion: p.occasion, recipientType: p.recipientType,
      }));

      const res = await fetch(`${SUPABASE_URL}/functions/v1/kit-builder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: g, products: slim }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to build kit");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const data = t.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              acc += delta;
              setGroups(parseGroups(acc));
            }
          } catch { /* partial */ }
        }
      }
    } catch (e) {
      toast({ title: "Couldn't build kit", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addAll = () => {
    let count = 0;
    for (const g of groups) {
      for (const item of g.items) {
        const p = catalog.find((c) => c.id === item.productId);
        if (p) { addItem({ id: p.id, name: p.name, price: p.price, image: p.image }); count++; }
      }
    }
    toast({ title: `Added ${count} items 🎁`, description: "Your kit is in the cart." });
  };

  const totalPrice = groups.reduce((sum, g) => sum + g.items.reduce((s, i) => {
    const p = catalog.find((c) => c.id === i.productId);
    return s + (p?.price ?? 0);
  }, 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> AI Kit Builder
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Build My Kit</h1>
          <p className="text-muted-foreground mt-2">Tell us your goal — we'll curate a complete kit in seconds.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); build(); }} className="flex gap-2 max-w-2xl mx-auto mb-4">
          <Input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Going to Goa for a bachelor party, build me a kit"
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !goal.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Build
          </Button>
        </form>

        {groups.length === 0 && !loading && (
          <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto mb-8">
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => build(ex)} className="text-xs px-3 py-1.5 rounded-full border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
                {ex}
              </button>
            ))}
          </div>
        )}

        {loading && groups.length === 0 && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-7 w-48 mb-3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => <Skeleton key={j} className="h-32 rounded-xl" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {groups.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border">
              <div>
                <div className="text-sm text-muted-foreground">Total kit value</div>
                <div className="text-2xl font-bold">{formatINR(totalPrice)}</div>
              </div>
              <Button size="lg" onClick={addAll}>
                <ShoppingCart className="h-4 w-4" /> Add All to Cart
              </Button>
            </div>

            <div className="space-y-8">
              {groups.map((group) => (
                <div key={group.name}>
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full" /> {group.name}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.items.map((item) => {
                      const p = catalog.find((c) => c.id === item.productId);
                      if (!p) return null;
                      return (
                        <Card key={item.productId} className="p-3 flex gap-3 hover:shadow-md transition-shadow">
                          <Link to={`/product/${p.id}`} className="shrink-0">
                            <img src={p.image} alt={p.name} className="h-20 w-20 rounded-lg object-cover" />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${p.id}`} className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary">{p.name}</Link>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.reason}</div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-sm text-primary">{formatINR(p.price)}</span>
                              <Button size="sm" variant="outline" className="h-7" onClick={() => {
                                addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
                                toast({ title: "Added 🎁", description: p.name });
                              }}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Parse streaming markdown into groups: ## Category \n [KIT id=N] reason
function parseGroups(text: string): KitGroup[] {
  const groups: KitGroup[] = [];
  const lines = text.split("\n");
  let current: KitGroup | null = null;
  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      if (current) groups.push(current);
      current = { name: h[1].trim(), items: [] };
      continue;
    }
    const k = line.match(/\[KIT id=(\d+)\]\s*(.*)/);
    if (k && current) {
      const id = parseInt(k[1], 10);
      if (!current.items.find((i) => i.productId === id)) {
        current.items.push({ productId: id, reason: k[2].trim() });
      }
    }
  }
  if (current && current.items.length > 0) groups.push(current);
  return groups;
}

export default KitBuilder;
