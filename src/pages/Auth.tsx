
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, User, LogIn } from "lucide-react";

// Password visibility toggle hook
function usePasswordToggle() {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible((v) => !v);
  return [visible, toggle] as const;
}

type AuthMode = "login" | "signup";

const Auth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwVisible, togglePwVisible] = usePasswordToggle();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  // Clear form errors when switching mode
  const handleModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setError("");
    setFullName("");
    setPassword("");
    setEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (authMode === "login") {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) setError(loginError.message);
      else navigate("/");
    } else {
      // Signup - Remove role assignment from frontend, always default to customer
      const redirectTo = `${window.location.origin}/auth`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            role: "customer" // Forced default on signup; admin role must be set by admin manually
          }
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setTimeout(() => {
          if (data.user?.id) {
            supabase
              .from("profiles")
              .update({
                email,
                full_name: fullName,
                role: "customer"
              })
              .eq("id", data.user.id);
          }
        }, 1000);
        setError("Check your email for a confirmation link.");
      }
    }

    setLoading(false);
    await refreshProfile();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center text-2xl font-poppins">
            {authMode === "login" ? <LogIn size={24} /> : <User size={24} />}
            {authMode === "login" ? "Login to Your Account" : "Create an Account"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="on">
          <CardContent className="space-y-4">
            {authMode === "signup" && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={pwVisible ? "text" : "password"}
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={togglePwVisible}
                  aria-label={pwVisible ? "Hide password" : "Show password"}
                >
                  {pwVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  {authMode === "login" ? "Logging in..." : "Signing up..."}
                </span>
              ) : (
                <>
                  {authMode === "login" ? "Login" : "Sign Up"}
                </>
              )}
            </Button>
            <div className="text-center text-muted-foreground text-sm">
              {authMode === "login" ? (
                <>
                  New user?{" "}
                  <button
                    className="text-blue-600 underline"
                    onClick={() => handleModeChange("signup")}
                    type="button"
                  >
                    Sign up here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="text-blue-600 underline"
                    onClick={() => handleModeChange("login")}
                    type="button"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
