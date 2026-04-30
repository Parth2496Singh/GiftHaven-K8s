import { useState } from "react";
import { Loader2, Scale, Trophy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { products as catalog, type Product } from "@/lib/products";
import { formatINR } from "@/lib/format";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface CompareResult {
  productA: { bestFor: string[]; drawbacks: string[] };
  productB: { bestFor: string[]; drawbacks: string[] };
  verdict: string;
  winner: "A" | "B" | "tie";
}

const ComparisonCard = ({ initialProduct }: { initialProduct: Product }) => {
  const [productB, setProductB] = useState<Product | null>(null);
  const [question, setQuestion] = useState("Which is better for daily use?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const { toast } = useToast();

  // suggest 6 alternatives in same category, excluding self
  const alternatives = catalog
    .filter((p) => p.id !== initialProduct.id && p.category === initialProduct.category)
    .slice(0, 6);

  const compare = async () => {
    if (!productB) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/compare-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, productA: initialProduct, productB }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Compare failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      toast({ title: "Compare failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Smart Compare</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Compare with another product in human terms — no jargon.</p>

      {!productB ? (
        <div>
          <div className="text-xs font-medium mb-2">Pick something to compare with:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {alternatives.map((p) => (
              <button key={p.id} onClick={() => setProductB(p)} className="text-left p-2 rounded-lg border hover:border-primary hover:bg-accent transition-colors">
                <img src={p.image} alt={p.name} className="w-full h-16 object-cover rounded mb-1" />
                <div className="text-xs font-medium line-clamp-1">{p.name}</div>
                <div className="text-xs text-primary">{formatINR(p.price)}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <ProductHeader p={initialProduct} label="A" winner={result?.winner === "A"} />
            <ProductHeader p={productB} label="B" winner={result?.winner === "B"} />
          </div>

          <div className="flex gap-2 mb-3">
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask: which is better for…?" />
            <Button onClick={compare} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Compare"}
            </Button>
          </div>

          {result && (
            <div className="space-y-3 animate-in fade-in">
              <div className="grid grid-cols-2 gap-3">
                <InsightBlock title="A is best for" pros={result.productA.bestFor} cons={result.productA.drawbacks} />
                <InsightBlock title="B is best for" pros={result.productB.bestFor} cons={result.productB.drawbacks} />
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-center gap-2 text-xs font-semibold mb-1"><Trophy className="h-3.5 w-3.5 text-primary" /> Verdict</div>
                <p className="text-sm">{result.verdict}</p>
              </div>
            </div>
          )}

          <button onClick={() => { setProductB(null); setResult(null); }} className="text-xs text-muted-foreground hover:text-foreground mt-3">← Pick a different product</button>
        </>
      )}
    </Card>
  );
};

const ProductHeader = ({ p, label, winner }: { p: Product; label: string; winner: boolean }) => (
  <div className={`p-2 rounded-lg border ${winner ? "border-primary bg-primary/5" : ""}`}>
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-xs">{label}</Badge>
      {winner && <Trophy className="h-3 w-3 text-primary" />}
    </div>
    <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded mt-1" />
    <div className="text-xs font-medium line-clamp-1 mt-1">{p.name}</div>
    <div className="text-xs text-primary font-semibold">{formatINR(p.price)}</div>
  </div>
);

const InsightBlock = ({ title, pros, cons }: { title: string; pros: string[]; cons: string[] }) => (
  <div className="p-3 rounded-lg bg-muted/50">
    <div className="text-xs font-semibold mb-2">{title}</div>
    <ul className="space-y-1">
      {pros.map((s, i) => <li key={`p${i}`} className="text-xs flex gap-1.5"><Check className="h-3 w-3 text-green-600 shrink-0 mt-0.5" /><span>{s}</span></li>)}
      {cons.map((s, i) => <li key={`c${i}`} className="text-xs flex gap-1.5 text-muted-foreground"><X className="h-3 w-3 text-orange-500 shrink-0 mt-0.5" /><span>{s}</span></li>)}
    </ul>
  </div>
);

export default ComparisonCard;
