import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner} alt="Beautiful gift boxes" className="w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>
      <div className="relative container mx-auto px-4 py-20 md:py-32 lg:py-40">
        <div className="max-w-xl space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Make Every Moment Special</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight">
            Find the Perfect <span className="text-accent">Gift</span> for Every Occasion
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Curated collections of thoughtful gifts, beautifully wrapped and delivered to your loved ones.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-gift text-primary-foreground rounded-full px-8 shadow-gift hover:opacity-90 transition-opacity">
              <Link to="/category/birthday-gifts">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/category/anniversary-gifts">Explore Collections</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
