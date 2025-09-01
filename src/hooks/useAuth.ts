import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Only attempt to sign out if there's an active session
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      // Always clear local state regardless
      setSession(null);
      setUser(null);
    } catch (error) {
      // Silently handle auth errors and clear local state
      console.warn('Logout warning:', error);
      setSession(null);
      setUser(null);
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user
  };
};