import { Gift, Heart, Sparkles, Truck, Shield, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  { Icon: Heart, title: "Made with Love", body: "Every gift is hand-curated by our team to make your loved ones feel special." },
  { Icon: Sparkles, title: "Premium Quality", body: "We partner with trusted artisans and brands so every product feels luxurious." },
  { Icon: Truck, title: "Pan-India Delivery", body: "Fast, reliable shipping to 27,000+ pincodes across India." },
  { Icon: Shield, title: "Safe & Secure", body: "Encrypted payments, easy cancellations, and a 7-day return promise." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative bg-gradient-to-br from-secondary via-background to-secondary py-20">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
          <Gift className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">About GiftHaven</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We believe every moment deserves to be celebrated. GiftHaven is a curated marketplace
          for thoughtful gifts that make every occasion unforgettable.
        </p>
      </div>
    </section>

    {/* Mission */}
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Our Mission</p>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Gifting, reimagined.</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We started GiftHaven with a simple idea — finding the right gift shouldn't feel like a chore.
            Whether it's a milestone birthday, a quiet anniversary, or a sweet "just because" gesture,
            our handpicked catalog is designed to spark a smile.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From personalized keepsakes to gourmet hampers, we bring together India's finest creators
            under one roof so you can shop with confidence and gift with joy.
          </p>
        </div>
        <div className="bg-gradient-gift rounded-2xl p-10 text-primary-foreground">
          <Users className="h-8 w-8 mb-3" />
          <p className="text-3xl font-serif font-bold">50,000+</p>
          <p className="text-sm opacity-90 mb-6">happy gift moments delivered</p>
          <p className="text-3xl font-serif font-bold">500+</p>
          <p className="text-sm opacity-90 mb-6">curated products</p>
          <p className="text-3xl font-serif font-bold">27,000+</p>
          <p className="text-sm opacity-90">pincodes served</p>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="bg-secondary/50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">What we stand for</h2>
          <p className="text-muted-foreground">The values that guide every gift we ship.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-gift transition-shadow">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-3">
                <v.Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-1.5">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
