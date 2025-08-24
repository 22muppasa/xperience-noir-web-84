
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'admin' | null;
  approvalStatus: 'pending' | 'approved' | 'rejected' | null;
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
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
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
          // Fetch user profile including approval status
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role, approval_status')
                .eq('id', session.user.id)
                .single();
              
              console.log('Profile data:', profile);
              setApprovalStatus(profile?.approval_status || 'pending');
              
              // Only set userRole to admin if both role is admin AND approval_status is approved
              if (profile?.role === 'admin' && profile?.approval_status === 'approved') {
                setUserRole('admin');
              } else {
                setUserRole(null);
              }
              
              // Redirect to admin dashboard on sign in from auth page if approved admin
              if (event === 'SIGNED_IN' && window.location.pathname === '/auth' && 
                  profile?.role === 'admin' && profile?.approval_status === 'approved') {
                navigate('/admin');
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUserRole(null);
              setApprovalStatus(null);
            }
          }, 0);
        } else {
          setUserRole(null);
          setApprovalStatus(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile for existing session
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, approval_status')
              .eq('id', session.user.id)
              .single();
            
            console.log('Existing session profile:', profile);
            setApprovalStatus(profile?.approval_status || 'pending');
            
            // Only set userRole to admin if both role is admin AND approval_status is approved
            if (profile?.role === 'admin' && profile?.approval_status === 'approved') {
              setUserRole('admin');
            } else {
              setUserRole(null);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUserRole(null);
            setApprovalStatus(null);
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
          role: 'admin' // Default all new users to admin
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
    setApprovalStatus(null);
    navigate('/');
  };

  const value = {
    user,
    session,
    userRole,
    approvalStatus,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
