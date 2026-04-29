import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Loader2, User as UserIcon, Mail, Phone, MapPin, LogOut, Package, Heart, Camera } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

const profileSchema = z.object({
  display_name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  phone: z.string().trim().max(20).regex(/^[+()\-\s\d]*$/, "Invalid phone").optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
});

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
}

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ display_name: "", phone: "", address: "" });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [profileRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("display_name, phone, address, avatar_url").eq("user_id", user.id).maybeSingle(),
        supabase.from("orders").select("id, status, total, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      if (profileRes.data) {
        setForm({
          display_name: profileRes.data.display_name || "",
          phone: profileRes.data.phone || "",
          address: profileRes.data.address || "",
        });
        setAvatarUrl(profileRes.data.avatar_url);
      }
      if (ordersRes.data) setRecentOrders(ordersRes.data as RecentOrder[]);
      setLoading(false);
    })();
  }, [user]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  const handleSave = async () => {
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: parsed.data.display_name,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null,
      })
      .eq("user_id", user!.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      toast.error(upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user.id);
    setAvatarUrl(url);
    setUploading(false);
    toast.success("Profile photo updated");
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">My Account</h1>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:opacity-90">
                        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                      </label>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {user?.email}</div>
                      <p className="text-xs mt-1">Click the camera to update your photo</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={form.display_name} onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" className="pl-10" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea id="address" className="pl-10 min-h-[80px]" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Street, city, state, pincode" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" /> Log out
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="font-serif">Recent Orders</CardTitle>
                  <Button asChild variant="link" size="sm"><Link to="/orders">View all</Link></Button>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.map((o) => (
                        <Link key={o.id} to="/orders" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary transition-colors">
                          <div>
                            <p className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-sm">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{formatINR(Number(o.total))}</p>
                            <Badge variant="secondary" className="text-xs">{o.status}</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link to="/orders"><Package className="h-4 w-4 mr-2" /> My Orders</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link to="/wishlist"><Heart className="h-4 w-4 mr-2" /> My Wishlist</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Account;
