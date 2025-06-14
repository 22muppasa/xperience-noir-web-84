
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "customer";
  created_at: string;
};

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get profile helper
  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();
    if (data) setProfile(data as Profile);
    else setProfile(null);
    setLoading(false);
  };

  // Auth state logic
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch profile if user exists
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    // Initial session/profile load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchProfile(data.session.user.id);
      else setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    navigate("/auth");
  };

  const refreshProfile = async () => {
    if (user?.id) fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
