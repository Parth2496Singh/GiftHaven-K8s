import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Gift, Menu, X, Heart, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  const navLinks = [
    { label: "Birthday", to: "/category/birthday-gifts" },
    { label: "Anniversary", to: "/category/anniversary-gifts" },
    { label: "For Him", to: "/category/gifts-for-him" },
    { label: "For Her", to: "/category/gifts-for-her" },
    { label: "Kids", to: "/category/kids-gifts" },
    { label: "Corporate", to: "/category/corporate-gifts" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Gift className="h-7 w-7 text-primary" />
            <span className="text-xl font-serif font-bold text-foreground">GiftHaven</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for the perfect gift..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-secondary transition-colors">
              <Heart className="h-5 w-5 text-foreground" />
            </Link>
            <Link to="/cart" className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-secondary transition-colors">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-2 border-card">
                  {totalItems}
                </Badge>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-secondary transition-colors">
                    <User className="h-5 w-5 text-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card">
                  <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            <button className="md:hidden flex items-center justify-center h-10 w-10" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 pb-2">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search gifts..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="block text-sm font-medium text-foreground py-2" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleSignOut} className="block text-sm font-medium text-destructive py-2 w-full text-left">
              Sign Out
            </button>
          ) : (
            <Link to="/auth" className="block text-sm font-medium text-primary py-2" onClick={() => setMobileOpen(false)}>
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
