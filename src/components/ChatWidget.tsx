import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME =
  "Hi! I'm GiftAI 🎁\n\nI'll help you find the perfect gift in seconds. Tell me a bit:\n\n- **Who** is it for? (girlfriend, dad, friend, kid…)\n- **Occasion?** (birthday, anniversary, festival…)\n- **Budget in ₹?**";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setLoading(true);

    try {
      const slim = products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        occasion: p.occasion,
        recipientType: p.recipientType,
        rating: p.rating,
      }));

      const res = await fetch(`${SUPABASE_URL}/functions/v1/gift-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          products: slim,
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Something went wrong");
      }

      // stream SSE
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
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
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                  ...copy[copy.length - 1],
                  content: copy[copy.length - 1].content + delta,
                };
                return copy;
              });
            }
          } catch {
            // ignore parse errors on partial chunks
          }
        }
      }
    } catch (e) {
      toast({
        title: "Chat unavailable",
        description: (e as Error).message,
        variant: "destructive",
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open gift assistant"
        className={cn(
          "fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full shadow-elegant transition-all hover:scale-105",
          "bg-gradient-gift text-primary-foreground flex items-center justify-center",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-md h-[70vh] max-h-[600px] rounded-2xl border bg-card shadow-elegant flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-gift text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">GiftAI Assistant</div>
              <div className="text-xs opacity-90">Find the perfect gift in seconds</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} onAdd={(p) => {
                addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
                toast({ title: "Added to cart 🎁", description: p.name });
              }} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> GiftAI is thinking…
              </div>
            )}
          </div>

          {/* Quick chips */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-2">
              {[
                "Gift for girlfriend under ₹1500",
                "Anniversary gift under ₹3000",
                "Birthday gift for kid",
                "Corporate gift under ₹2000",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="border-t p-3 flex items-center gap-2 bg-card"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what you're looking for…"
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

// Renders message body, replacing [GIFT id=N] tokens with rich product cards
const GIFT_REGEX = /\[GIFT id=(\d+)\][^\n]*/g;

const MessageBubble = ({
  message,
  onAdd,
}: {
  message: ChatMessage;
  onAdd: (p: typeof products[number]) => void;
}) => {
  const isUser = message.role === "user";

  // Split content into text + gift cards
  const parts: Array<{ type: "text"; text: string } | { type: "gift"; productId: number }> = [];
  let lastIndex = 0;
  const text = message.content;
  let match: RegExpExecArray | null;
  const re = new RegExp(GIFT_REGEX.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push({ type: "text", text: text.slice(lastIndex, match.index) });
    parts.push({ type: "gift", productId: parseInt(match[1], 10) });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push({ type: "text", text: text.slice(lastIndex) });

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm",
        )}
      >
        {parts.map((part, i) =>
          part.type === "text" ? (
            <div key={i} className="prose prose-sm max-w-none dark:prose-invert [&>*]:my-1">
              <ReactMarkdown>{part.text}</ReactMarkdown>
            </div>
          ) : (
            <GiftCard key={i} productId={part.productId} onAdd={onAdd} />
          ),
        )}
      </div>
    </div>
  );
};

const GiftCard = ({
  productId,
  onAdd,
}: {
  productId: number;
  onAdd: (p: typeof products[number]) => void;
}) => {
  const product = products.find((p) => p.id === productId);
  if (!product) return null;
  return (
    <div className="my-2 rounded-xl border bg-card text-card-foreground overflow-hidden shadow-sm">
      <div className="flex gap-3 p-2">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-16 w-16 rounded-lg object-cover shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=300&q=80";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-xs leading-tight line-clamp-2">{product.name}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-bold text-sm text-primary">{formatINR(product.price)}</span>
            <span className="text-[10px] text-muted-foreground">★ {product.rating}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 p-2 pt-0">
        <Button size="sm" variant="outline" asChild className="h-7 text-xs">
          <Link to={`/product/${product.id}`}>
            <Eye className="h-3 w-3" /> View
          </Link>
        </Button>
        <Button size="sm" onClick={() => onAdd(product)} className="h-7 text-xs">
          <ShoppingCart className="h-3 w-3" /> Add
        </Button>
      </div>
    </div>
  );
};

export default ChatWidget;
