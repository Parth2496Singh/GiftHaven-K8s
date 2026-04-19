import { Sparkles, Tag, Truck, Gift, BadgePercent, Clock } from "lucide-react";

const offers = [
  { icon: BadgePercent, text: "FLAT 20% OFF on Birthday Gifts — Code: BDAY20" },
  { icon: Truck, text: "FREE Shipping on orders above ₹999" },
  { icon: Gift, text: "Buy 2 Get 1 FREE on Scented Candles" },
  { icon: Tag, text: "Up to 50% OFF on Anniversary Collection" },
  { icon: Sparkles, text: "Extra 10% OFF for first-time shoppers — Code: WELCOME10" },
  { icon: Clock, text: "Same-day delivery available in 100+ cities" },
];

const OffersStrip = () => {
  // duplicate the list so the marquee loops seamlessly
  const loop = [...offers, ...offers];
  return (
    <div className="bg-gradient-gift text-primary-foreground overflow-hidden border-b border-primary/20">
      <div className="relative flex whitespace-nowrap py-2">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {loop.map((o, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-medium">
              <o.icon className="h-4 w-4 text-accent" />
              <span>{o.text}</span>
              <span className="ml-6 text-primary-foreground/40">•</span>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10" aria-hidden="true">
          {loop.map((o, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-2 text-sm font-medium">
              <o.icon className="h-4 w-4 text-accent" />
              <span>{o.text}</span>
              <span className="ml-6 text-primary-foreground/40">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersStrip;
