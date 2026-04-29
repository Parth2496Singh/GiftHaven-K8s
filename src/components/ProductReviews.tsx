import { useEffect, useState } from "react";
import { Star, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  display_name?: string | null;
}

const StarRow = ({ value, onChange, size = "h-5 w-5" }: { value: number; onChange?: (n: number) => void; size?: string }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        className={onChange ? "hover:scale-110 transition-transform" : ""}
        aria-label={`${n} star${n > 1 ? "s" : ""}`}
      >
        <Star className={`${size} ${n <= value ? "fill-accent text-accent" : "text-border"}`} />
      </button>
    ))}
  </div>
);

interface Props { productId: number }

const ProductReviews = ({ productId }: Props) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, user_id, rating, comment, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else {
      const list = (data as Review[]) || [];
      const ids = [...new Set(list.map((r) => r.user_id))];
      if (ids.length) {
        const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", ids);
        const map = new Map((profiles || []).map((p: any) => [p.user_id, p.display_name]));
        list.forEach((r) => (r.display_name = map.get(r.user_id) || "Anonymous"));
      }
      setReviews(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // pre-fill if user already reviewed
  }, [productId]);

  useEffect(() => {
    if (user) {
      const mine = reviews.find((r) => r.user_id === user.id);
      if (mine) {
        setRating(mine.rating);
        setComment(mine.comment || "");
      }
    }
  }, [user, reviews]);

  const submit = async () => {
    if (!user) {
      toast.error("Please sign in to review");
      return;
    }
    if (rating < 1) {
      toast.error("Please pick a star rating");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").upsert(
      { user_id: user.id, product_id: productId, rating, comment: comment.trim() || null },
      { onConflict: "user_id,product_id" }
    );
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Review saved");
    load();
  };

  const deleteMine = async () => {
    if (!user) return;
    const { error } = await supabase.from("reviews").delete().eq("user_id", user.id).eq("product_id", productId);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRating(0);
    setComment("");
    toast.success("Review deleted");
    load();
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const myReview = user ? reviews.find((r) => r.user_id === user.id) : null;

  return (
    <section className="container mx-auto px-4 py-10 border-t border-border">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRow value={Math.round(avg)} />
            <span className="text-sm text-muted-foreground">
              {reviews.length > 0 ? `${avg.toFixed(1)} from ${reviews.length} review${reviews.length > 1 ? "s" : ""}` : "No reviews yet"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        <div className="bg-card border border-border rounded-xl p-5 h-fit space-y-4">
          <h3 className="font-semibold">{myReview ? "Update your review" : "Write a review"}</h3>
          {!user ? (
            <div className="text-sm text-muted-foreground">
              <Link to="/auth" className="text-primary underline">Sign in</Link> to leave a review.
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Your rating</p>
                <StarRow value={rating} onChange={setRating} size="h-7 w-7" />
              </div>
              <Textarea placeholder="Share your thoughts (optional)" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} />
              <div className="flex gap-2">
                <Button onClick={submit} disabled={submitting} className="flex-1">
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {myReview ? "Update" : "Submit"}
                </Button>
                {myReview && (
                  <Button variant="outline" size="icon" onClick={deleteMine} aria-label="Delete review">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">Be the first to review this gift.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm">{r.display_name || "Anonymous"}</p>
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-IN")}</span>
                </div>
                <StarRow value={r.rating} size="h-4 w-4" />
                {r.comment && <p className="text-sm text-foreground mt-2 leading-relaxed">{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
