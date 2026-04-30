import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { products as catalog } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

interface Msg { role: "user" | "assistant"; content: string }

const Copilot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [productIds, setProductIds] = useState<number[]>(catalog.slice(0, 8).map((p) => p.id));
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);
  const { toast } = useToast();

  // Setup Web Speech API
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "en-IN";
    r.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      void send(transcript);
    };
    r.onerror = () => { setListening(false); toast({ title: "Voice input failed", variant: "destructive" }); };
    r.onend = () => setListening(false);
    recogRef.current = r;
  }, []);

  const toggleMic = () => {
    if (!recogRef.current) {
      toast({ title: "Voice not supported", description: "Try Chrome or Edge.", variant: "destructive" });
      return;
    }
    if (listening) { recogRef.current.stop(); setListening(false); }
    else { recogRef.current.start(); setListening(true); }
  };

  const send = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: t }];
    setMessages(next);
    setLoading(true);

    try {
      const slim = catalog.map((p) => ({
        id: p.id, name: p.name, price: p.price, category: p.category,
        occasion: p.occasion, recipientType: p.recipientType, rating: p.rating,
      }));
      const res = await fetch(`${SUPABASE_URL}/functions/v1/copilot-refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, products: slim, currentFilters: filters }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Copilot failed");
      }
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || "Updated." }]);
      if (Array.isArray(data.productIds) && data.productIds.length > 0) setProductIds(data.productIds);
      if (data.filters) setFilters(data.filters);
    } catch (e) {
      toast({ title: "Copilot error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const visibleProducts = productIds.map((id) => catalog.find((p) => p.id === id)).filter(Boolean) as typeof catalog;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Hybrid Copilot
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Shop with voice or text</h1>
          <p className="text-muted-foreground mt-2">Talk or type — I'll refine results live. Try "show cheaper ones" or "only for her".</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 max-w-3xl mx-auto mb-4">
          <Button type="button" size="icon" variant={listening ? "destructive" : "outline"} onClick={toggleMic}>
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening…" : "Type or tap the mic"}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        {messages.length > 0 && (
          <div className="max-w-3xl mx-auto mb-6 space-y-2">
            {messages.slice(-4).map((m, i) => (
              <div key={i} className={`text-sm px-3 py-2 rounded-lg ${m.role === "user" ? "bg-primary/10 text-foreground ml-12" : "bg-muted text-foreground mr-12"}`}>
                <span className="font-semibold mr-1">{m.role === "user" ? "You:" : "AI:"}</span>{m.content}
              </div>
            ))}
          </div>
        )}

        {Object.keys(filters).length > 0 && (
          <div className="max-w-3xl mx-auto mb-6 flex flex-wrap gap-2 text-xs">
            {Object.entries(filters).map(([k, v]) =>
              v ? <span key={k} className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{k}: {Array.isArray(v) ? v.join(", ") : String(v)}</span> : null
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all">
          {loading && visibleProducts.length === 0
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
            : visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};

export default Copilot;
