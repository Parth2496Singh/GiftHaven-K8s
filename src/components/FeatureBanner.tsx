import { Gift, Truck, Shield, Clock } from "lucide-react";

const features = [
  { icon: Gift, title: "Gift Wrapping", desc: "Beautiful packaging included" },
  { icon: Truck, title: "Free Shipping", desc: "On orders over ₹999" },
  { icon: Shield, title: "Secure Checkout", desc: "100% safe payments" },
  { icon: Clock, title: "Same Day Delivery", desc: "Order before 2 PM" },
];

const FeatureBanner = () => {
  return (
    <section className="bg-gift-warm">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">{f.title}</h4>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBanner;
