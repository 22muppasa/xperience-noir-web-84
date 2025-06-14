
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "signup";

const Auth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/");
    } else {
      // Signup flow: create user, then update profile
      const redirectTo = `${window.location.origin}/auth`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            role,
          }
        },
      });
      if (signUpError) setError(signUpError.message);
      else {
        // Insert profile row (handled by signup trigger if set!)
        setTimeout(() => {
          if (data.user?.id) {
            supabase
              .from("profiles")
              .update({
                email,
                full_name: fullName,
                role
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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-black rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center font-poppins">
          {authMode === "login" ? "Login to Your Account" : "Create an Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "signup" && (
            <>
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={role === "customer"}
                    onChange={() => setRole("customer")}
                  /> Customer
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                  /> Admin
                </label>
              </div>
            </>
          )}
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? (authMode === "login" ? "Logging in..." : "Signing up...")
              : (authMode === "login" ? "Login" : "Sign Up")}
          </Button>
        </form>
        <div className="mt-4 text-center">
          {authMode === "login" ? (
            <>
              New user?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setAuthMode("signup")}
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
