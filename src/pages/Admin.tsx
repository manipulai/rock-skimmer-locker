import AdminApplicationList from '@/components/AdminApplicationList';
import { Button } from '@/components/ui/button';
import { seedData } from '@/lib/seedData';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAdmin } from '@/contexts/AdminContext';
import { useEffect, useRef } from 'react';

const Admin = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdmin();

  // Clear merchant applications data when admin mode changes
  useEffect(() => {
    if (!isAdmin) {
      // Clear the merchant applications data when admin mode is turned off
      queryClient.setQueryData(['merchantApplications'], []);
      console.log('Admin mode turned off - cleared merchant applications data');
    }
  }, [isAdmin, queryClient]);

  // Reference to the AdminApplicationList component
  const adminListRef = useRef<{ refetch: () => Promise<any> } | null>(null);

  const handleLoadApplications = async () => {
    try {
      // Show loading toast
      toast.loading('Loading applications...');
      
      // Clear any existing data first
      queryClient.setQueryData(['merchantApplications'], []);
      
      // Seed the data
      const result = await seedData();
      
      if (result.success) {
        // Force a refresh of the merchant applications data
        await queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
        
        // Explicitly refetch the merchant applications
        await queryClient.refetchQueries({ queryKey: ['merchantApplications'], exact: true });
        
        // Directly trigger refetch on the AdminApplicationList component
        if (adminListRef.current) {
          await adminListRef.current.refetch();
        }
        
        // Dismiss loading toast and show success
        toast.dismiss();
        toast.success(result.message);
        
        console.log('Applications loaded successfully:', result.data);
      } else {
        // Dismiss loading toast and show error
        toast.dismiss();
        toast.error('Failed to load applications: ' + result.message);
      }
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss();
      toast.error('Error loading applications: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-blue-50 to-slate-100 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {isAdmin ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-800">
                Merchant Applications
              </h1>
              <Button 
                onClick={handleLoadApplications}
                variant="outline"
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
              >
                🔄 Load Applications
              </Button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <AdminApplicationList ref={adminListRef} />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Admin Area</h1>
            <p className="text-slate-600">Admin mode is currently disabled. Enable admin mode to view merchant applications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
