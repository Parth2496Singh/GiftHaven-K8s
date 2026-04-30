import { useState } from "react";
import { Loader2, FlaskConical, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { products as catalog, type Product } from "@/lib/products";
import { formatINR } from "@/lib/format";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface ScenarioResult {
  fit: "excellent" | "good" | "okay" | "poor";
  verdict: string;
  pros: string[];
  cons: string[];
  alternatives: { productId: number; reason: string }[];
}

const FIT_COLORS: Record<string, string> = {
  excellent: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
  good: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  okay: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  poor: "bg-destructive/15 text-destructive border-destructive/30",
};

const EXAMPLES = [
  "Will this work for a heavy gym session?",
  "Is this good as a corporate gift?",
  "Will my 5-year-old enjoy this?",
];

const ScenarioSimulation = ({ product }: { product: Product }) => {
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const { toast } = useToast();

  const ask = async (text?: string) => {
    const s = (text ?? scenario).trim();
    if (!s) return;
    setScenario(s);
    setLoading(true);
    setResult(null);
    try {
      const slim = catalog.map((p) => ({ id: p.id, name: p.name, price: p.price, category: p.category }));
      const res = await fetch(`${SUPABASE_URL}/functions/v1/scenario-sim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: s, product, alternatives: slim }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Scenario check failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      toast({ title: "Couldn't evaluate", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Will it work for…?</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Ask a real-world scenario. We'll give you an honest answer.</p>

      <form onSubmit={(e) => { e.preventDefault(); ask(); }} className="flex gap-2 mb-3">
        <Input value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="e.g. Will this last on a beach trip?" />
        <Button type="submit" disabled={loading || !scenario.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
        </Button>
      </form>

      {!result && !loading && (
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => ask(ex)} className="text-xs px-2.5 py-1 rounded-full border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors">
              {ex}
            </button>
          ))}
        </div>
      )}

      {result && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Badge className={`${FIT_COLORS[result.fit]} border capitalize`}>{result.fit} fit</Badge>
          </div>
          <p className="text-sm">{result.verdict}</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green-600 mb-1"><ThumbsUp className="h-3 w-3" /> Pros</div>
              <ul className="space-y-1">{result.pros.map((p, i) => <li key={i} className="text-xs">• {p}</li>)}</ul>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 mb-1"><ThumbsDown className="h-3 w-3" /> Cons</div>
              <ul className="space-y-1">{result.cons.map((c, i) => <li key={i} className="text-xs">• {c}</li>)}</ul>
            </div>
          </div>

          {result.alternatives?.length > 0 && (
            <div>
              <div className="text-xs font-semibold mb-2">Better alternatives</div>
              <div className="space-y-2">
                {result.alternatives.map((a) => {
                  const p = catalog.find((c) => c.id === a.productId);
                  if (!p) return null;
                  return (
                    <Link key={a.productId} to={`/product/${p.id}`} className="flex gap-2 p-2 rounded-lg border hover:border-primary hover:bg-accent transition-colors">
                      <img src={p.image} alt={p.name} className="h-12 w-12 rounded object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium line-clamp-1">{p.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{a.reason}</div>
                        <div className="text-xs text-primary font-semibold">{formatINR(p.price)}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ScenarioSimulation;
