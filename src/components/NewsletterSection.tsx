import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Subscribed!", description: "You'll receive our latest gift ideas and offers." });
    setEmail("");
  };

  return (
    <section className="bg-gradient-gift py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif font-bold text-primary-foreground">Never Miss a Perfect Gift</h2>
        <p className="text-primary-foreground/80 mt-2 mb-6 max-w-md mx-auto">
          Subscribe for curated gift guides, exclusive offers, and occasion reminders.
        </p>
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-full text-sm bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
          />
          <Button type="submit" size="lg" className="rounded-full bg-primary-foreground text-foreground hover:bg-primary-foreground/90 px-6">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
