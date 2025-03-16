import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  checkAdminPermissions: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      if (!user) return false;
      
      const { data: adminRole, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('Admin role check:', { adminRole, error });
        
      if (error) {
        console.error('Admin check error:', error);
        return false;
      }
      
      return adminRole?.role === 'admin';
    } catch (error) {
      console.error('Admin check failed:', error);
      return false;
    }
  };

  useEffect(() => {
    checkAdminPermissions().then(setIsAdmin);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, checkAdminPermissions }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}