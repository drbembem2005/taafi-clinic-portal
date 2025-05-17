
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

type AdminAuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is admin after state update
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.email || '');
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.email || '');
      }
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const checkAdminStatus = async (email: string) => {
    try {
      // For now, we'll use a hardcoded list of admin emails
      // This should be replaced with a proper admin users table in the database
      const adminEmails = ['admin@example.com', 'dr.bembem2005@hotmail.com'];
      
      setIsAdmin(adminEmails.includes(email.toLowerCase()));
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: error.message,
        });
        return;
      }
      
      if (data.user) {
        // Check if the user is an admin
        await checkAdminStatus(data.user.email || '');
        
        if (!isAdmin) {
          // If not admin, sign them out
          toast({
            variant: "destructive",
            title: "خطأ في الوصول",
            description: "ليس لديك صلاحيات للوصول إلى لوحة التحكم",
          });
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "تم تسجيل الخروج",
        description: "تم تسجيل خروجك بنجاح",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
      });
    }
  };
  
  return (
    <AdminAuthContext.Provider value={{ session, user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
