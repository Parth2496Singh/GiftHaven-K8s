import { Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="h-6 w-6 text-primary" />
              <span className="text-lg font-serif font-bold text-foreground">GiftHaven</span>
            </div>
            <p className="text-sm text-muted-foreground">Making every occasion special with thoughtfully curated gifts.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/birthday-gifts" className="hover:text-primary transition-colors">Birthday Gifts</Link></li>
              <li><Link to="/category/anniversary-gifts" className="hover:text-primary transition-colors">Anniversary Gifts</Link></li>
              <li><Link to="/category/gifts-for-him" className="hover:text-primary transition-colors">Gifts for Him</Link></li>
              <li><Link to="/category/gifts-for-her" className="hover:text-primary transition-colors">Gifts for Her</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 GiftHaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
