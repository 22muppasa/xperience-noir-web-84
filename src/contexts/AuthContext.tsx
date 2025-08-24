
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'admin' | null;
  isApproved: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'admin' | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role and approval status
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role, approval_status')
                .eq('id', session.user.id)
                .single();
              
              const isUserApproved = profile?.approval_status === 'approved';
              const isAdmin = profile?.role === 'admin';
              
              setUserRole(isAdmin ? 'admin' : null);
              setIsApproved(isUserApproved);
              
              // Redirect to admin dashboard on sign in from auth page if user is approved admin
              if (event === 'SIGNED_IN' && window.location.pathname === '/auth') {
                if (isAdmin && isUserApproved) {
                  navigate('/admin');
                } else {
                  navigate('/');
                }
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUserRole(null);
              setIsApproved(false);
            }
          }, 0);
        } else {
          setUserRole(null);
          setIsApproved(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user role and approval status for existing session
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, approval_status')
              .eq('id', session.user.id)
              .single();
            
            const isUserApproved = profile?.approval_status === 'approved';
            const isAdmin = profile?.role === 'admin';
            
            setUserRole(isAdmin ? 'admin' : null);
            setIsApproved(isUserApproved);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUserRole(null);
            setIsApproved(false);
          }
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, userData = {}) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          ...userData,
          role: 'admin' // Default all new users to admin (but pending approval)
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setIsApproved(false);
    navigate('/');
  };

  const value = {
    user,
    session,
    userRole,
    isApproved,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
