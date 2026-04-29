import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Gift, Menu, X, Heart, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
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
import SearchBar from "@/components/SearchBar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const navLinks = [
    { label: "Birthday", to: "/category/birthday-gifts" },
    { label: "Anniversary", to: "/category/anniversary-gifts" },
    { label: "For Him", to: "/category/gifts-for-him" },
    { label: "For Her", to: "/category/gifts-for-her" },
    { label: "Kids", to: "/category/kids-gifts" },
    { label: "Corporate", to: "/category/corporate-gifts" },
    { label: "About", to: "/about" },
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
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="relative hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-secondary transition-colors">
              <Heart className="h-5 w-5 text-foreground" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-2 border-card">
                  {wishlistItems.length}
                </Badge>
              )}
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
          <SearchBar compact onNavigate={() => setMobileOpen(false)} />
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="block text-sm font-medium text-foreground py-2" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/account" className="block text-sm font-medium text-foreground py-2" onClick={() => setMobileOpen(false)}>My Account</Link>
              <Link to="/wishlist" className="block text-sm font-medium text-foreground py-2" onClick={() => setMobileOpen(false)}>Wishlist</Link>
              <button onClick={handleSignOut} className="block text-sm font-medium text-destructive py-2 w-full text-left">
                Sign Out
              </button>
            </>
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
