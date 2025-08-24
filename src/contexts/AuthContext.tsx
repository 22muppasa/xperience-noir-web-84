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

  const createUserProfile = async (userId: string, userEmail: string): Promise<boolean> => {
    try {
      console.log('Creating profile for user:', userId, userEmail);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userEmail,
          role: 'admin', // Default role for new users
          approval_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return false;
      }

      console.log('Profile created successfully:', data);
      return true;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return false;
    }
  };

  const fetchUserProfile = async (userId: string): Promise<boolean> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, approval_status')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create...');
          const user = await supabase.auth.getUser();
          if (user.data.user?.email) {
            const created = await createUserProfile(userId, user.data.user.email);
            if (created) {
              // Retry fetching after creation
              return await fetchUserProfile(userId);
            }
          }
        }
        
        setUserRole(null);
        setIsApproved(false);
        return false;
      }

      console.log('User profile data:', profile);
      
      if (!profile) {
        console.warn('No profile found for user:', userId);
        setUserRole(null);
        setIsApproved(false);
        return false;
      }

      const isUserApproved = profile?.approval_status === 'approved';
      const isAdmin = profile?.role === 'admin';
      
      setUserRole(isAdmin ? 'admin' : null);
      setIsApproved(isUserApproved);
      
      console.log('User role:', isAdmin ? 'admin' : null);
      console.log('User approved:', isUserApproved);
      return true;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUserRole(null);
      setIsApproved(false);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    let loadingTimeout: NodeJS.Timeout;

    // Set a maximum loading time
    loadingTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth loading timeout reached');
        setLoading(false);
      }
    }, 10000);

    const handleAuthStateChange = async (event: any, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (!isMounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const profileFetched = await fetchUserProfile(session.user.id);
          
          if (event === 'SIGNED_IN' && window.location.pathname === '/auth' && profileFetched) {
            setTimeout(() => {
              if (isMounted) {
                navigate('/admin');
              }
            }, 100);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        }
      } else {
        setUserRole(null);
        setIsApproved(false);
      }
      
      if (isMounted) {
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            clearTimeout(loadingTimeout);
            setLoading(false);
          }
          return;
        }

        if (!isMounted) return;

        console.log('Session found:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            await fetchUserProfile(session.user.id);
          } catch (error) {
            console.error('Error fetching profile during initialization:', error);
          }
        }
        
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (isMounted) {
          clearTimeout(loadingTimeout);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      subscription.unsubscribe();
    };
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
          role: 'admin'
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
