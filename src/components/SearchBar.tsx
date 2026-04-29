import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { products } from "@/lib/products";
import { formatINR } from "@/lib/format";

interface Props { compact?: boolean; onNavigate?: () => void }

const SearchBar = ({ compact = false, onNavigate }: Props) => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const term = q.trim().toLowerCase();
  const suggestions = term
    ? products
        .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(term))
        .slice(0, 6)
    : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    onNavigate?.();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const go = (path: string) => {
    setOpen(false);
    setQ("");
    onNavigate?.();
    navigate(path);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <form onSubmit={submit}>
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder={compact ? "Search gifts..." : "Search for the perfect gift..."}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </form>
      {open && term && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(`/product/${p.id}`)}
                  className="w-full flex items-center gap-3 p-2.5 hover:bg-secondary text-left transition-colors"
                >
                  <img src={p.image} alt="" className="h-10 w-10 rounded object-cover bg-secondary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <span className="text-sm font-semibold shrink-0">{formatINR(p.price)}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
                className="w-full p-2.5 text-sm text-primary font-medium hover:bg-secondary border-t border-border"
              >
                See all results for "{q.trim()}"
              </button>
            </>
          ) : (
            <div className="p-4 text-sm text-muted-foreground text-center">No matches. Press Enter to search anyway.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
