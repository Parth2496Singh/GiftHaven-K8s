import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Gift, Loader2, Mail, Lock, User as UserIcon, Phone, MapPin, CheckCircle2, MailCheck, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
});

const signupSchema = z
  .object({
    displayName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(60),
    email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
    confirmPassword: z.string(),
    phone: z
      .string()
      .trim()
      .max(20, { message: "Phone is too long" })
      .regex(/^[+()\-\s\d]*$/, { message: "Phone can only contain digits and + - ( )" })
      .optional()
      .or(z.literal("")),
    address: z.string().trim().max(500, { message: "Address must be under 500 characters" }).optional().or(z.literal("")),
    role: z.enum(["user", "admin"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupErrors = Partial<Record<keyof z.infer<typeof signupSchema>, string>>;

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const defaultTab = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "user" as "user" | "admin",
  });
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});

  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true });
  }, [user, authLoading, navigate]);

  const signupValid = useMemo(() => signupSchema.safeParse(signupForm).success, [signupForm]);

  const setField = <K extends keyof typeof signupForm>(key: K, value: (typeof signupForm)[K]) => {
    setSignupForm((prev) => ({ ...prev, [key]: value }));
    if (signupErrors[key]) setSignupErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(loginForm);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Invalid email or password" : error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(signupForm);
    if (!parsed.success) {
      const errs: SignupErrors = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof SignupErrors;
        if (key && !errs[key]) errs[key] = err.message;
      });
      setSignupErrors(errs);
      return;
    }
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: parsed.data.displayName,
          phone: parsed.data.phone || null,
          address: parsed.data.address || null,
        },
      },
    });

    if (error) {
      setLoading(false);
      const msg = error.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        setSignupErrors({ email: "This email is already registered" });
        toast.error("This email is already registered");
      } else {
        toast.error(error.message);
      }
      return;
    }

    // Best-effort: persist phone/address into profile (the trigger creates the row).
    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          phone: parsed.data.phone || null,
          address: parsed.data.address || null,
        })
        .eq("user_id", data.user.id);
    }

    setLoading(false);
    setSignupSuccess(true);
    toast.success("Account created! Welcome to GiftHaven 🎁");
    setTimeout(() => navigate("/"), 1200);
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setOauthLoading(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}/`,
    });
    if (result.error) {
      toast.error(result.error.message || `Could not sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <Gift className="h-8 w-8 text-primary" />
          <span className="text-2xl font-serif font-bold text-foreground">GiftHaven</span>
        </Link>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-serif">Welcome</CardTitle>
            <CardDescription>Sign in or create an account to start gifting</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="login-email" type="email" placeholder="you@example.com" className="pl-10"
                        value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="login-password" type="password" placeholder="••••••••" className="pl-10"
                        value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {signupSuccess ? (
                  <div className="flex flex-col items-center text-center py-8 space-y-3">
                    <CheckCircle2 className="h-14 w-14 text-primary" />
                    <h3 className="text-lg font-semibold">Account created!</h3>
                    <p className="text-sm text-muted-foreground">Redirecting you to the store…</p>
                  </div>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4" noValidate>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name">Full Name <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-name" type="text" placeholder="Jane Doe" className="pl-10"
                          value={signupForm.displayName}
                          onChange={(e) => setField("displayName", e.target.value)}
                          aria-invalid={!!signupErrors.displayName} />
                      </div>
                      {signupErrors.displayName && <p className="text-xs text-destructive">{signupErrors.displayName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email">Email <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="you@example.com" className="pl-10"
                          value={signupForm.email}
                          onChange={(e) => setField("email", e.target.value)}
                          aria-invalid={!!signupErrors.email} />
                      </div>
                      {signupErrors.email && <p className="text-xs text-destructive">{signupErrors.email}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password">Password <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-password" type="password" placeholder="At least 6 characters" className="pl-10"
                          value={signupForm.password}
                          onChange={(e) => setField("password", e.target.value)}
                          aria-invalid={!!signupErrors.password} />
                      </div>
                      {signupErrors.password && <p className="text-xs text-destructive">{signupErrors.password}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-confirm">Confirm Password <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-confirm" type="password" placeholder="Re-enter password" className="pl-10"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setField("confirmPassword", e.target.value)}
                          aria-invalid={!!signupErrors.confirmPassword} />
                      </div>
                      {signupErrors.confirmPassword && <p className="text-xs text-destructive">{signupErrors.confirmPassword}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-phone">Phone <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-phone" type="tel" placeholder="+91 98765 43210" className="pl-10"
                          value={signupForm.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                          aria-invalid={!!signupErrors.phone} />
                      </div>
                      {signupErrors.phone && <p className="text-xs text-destructive">{signupErrors.phone}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-address">Address <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea id="signup-address" placeholder="Street, city, state, pincode" className="pl-10 min-h-[80px]"
                          value={signupForm.address}
                          onChange={(e) => setField("address", e.target.value)}
                          aria-invalid={!!signupErrors.address} />
                      </div>
                      {signupErrors.address && <p className="text-xs text-destructive">{signupErrors.address}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signup-role">Role</Label>
                      <Select value={signupForm.role} onValueChange={(v) => setField("role", v as "user" | "admin")}>
                        <SelectTrigger id="signup-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        New accounts are created as <strong>user</strong>. Admin access is granted manually.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || !signupValid}>
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={() => handleOAuth("google")} disabled={!!oauthLoading}>
                {oauthLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Google
              </Button>
              <Button type="button" variant="outline" onClick={() => handleOAuth("apple")} disabled={!!oauthLoading}>
                {oauthLoading === "apple" ? <Loader2 className="h-4 w-4 animate-spin" /> : <AppleIcon />}
                Apple
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to GiftHaven's Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
