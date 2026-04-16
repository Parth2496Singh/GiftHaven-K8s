import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/products";

const categoryMap: Record<string, string> = {
  "birthday-gifts": "Birthday Gifts",
  "anniversary-gifts": "Anniversary Gifts",
  "gifts-for-him": "Gifts for Him",
  "gifts-for-her": "Gifts for Her",
  "kids-gifts": "Kids Gifts",
  "corporate-gifts": "Corporate Gifts",
};

const CategoryPage = () => {
  const { slug } = useParams();
  const categoryName = categoryMap[slug || ""] || "All Gifts";
  const filtered = slug ? products.filter((p) => p.category === categoryName) : products;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">{categoryName}</h1>
        <p className="text-muted-foreground mb-8">{filtered.length} gifts found</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No gifts found in this category yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
