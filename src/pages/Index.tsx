import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import FeatureBanner from "@/components/FeatureBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductSection from "@/components/ProductSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";

const trending = products.filter((p) => p.badge === "Trending" || p.badge === "Popular");
const bestSellers = products.filter((p) => p.badge === "Best Seller");
const recommended = products.slice(0, 8);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <FeatureBanner />
      <CategoryGrid />
      <ProductSection title="Trending Gifts" subtitle="Most loved gifts right now" products={trending} viewAllLink="/category/birthday-gifts" />
      <ProductSection title="Best Sellers" subtitle="Our all-time favorites" products={bestSellers} viewAllLink="/category/anniversary-gifts" />
      <div className="bg-gift-warm">
        <ProductSection title="Recommended for You" subtitle="Handpicked gift ideas you'll love" products={recommended} />
      </div>
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
