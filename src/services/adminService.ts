import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
}

export async function createAdminUser(email: string, password: string): Promise<boolean> {
  try {
    // First, create the user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error('User creation failed');
    }
    
    // Then add the user to the admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: authData.user.id,
        email: authData.user.email,
      });
    
    if (adminError) {
      throw adminError;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    toast({
      title: 'خطأ',
      description: 'حدث خطأ أثناء إنشاء المستخدم الإداري',
      variant: 'destructive',
    });
    return false;
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function getAllAdmins(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data as AdminUser[];
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
}

export async function removeAdmin(userId: string): Promise<boolean> {
  try {
    // First remove from admin_users
    const { error: adminRemoveError } = await supabase
      .from('admin_users')
      .delete()
      .eq('user_id', userId);
    
    if (adminRemoveError) {
      throw adminRemoveError;
    }
    
    // Then delete the user account (optional)
    // This depends on your requirements - you might want to keep the user
    // but just remove admin privileges
    
    return true;
  } catch (error) {
    console.error('Error removing admin:', error);
    return false;
  }
}
