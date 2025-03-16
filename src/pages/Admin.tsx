import AdminApplicationList from '@/components/AdminApplicationList';
import { Button } from '@/components/ui/button';
import { seedData } from '@/lib/seedData';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAdmin } from '@/contexts/AdminContext';

const Admin = () => {
  const queryClient = useQueryClient();
  const { isAdmin } = useAdmin();

  const handleLoadApplications = async () => {
    try {
      const result = await seedData();
      if (result.success) {
        // Force a refresh of the merchant applications data
        await queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
        toast.success(result.message);
      } else {
        toast.error('Failed to load applications: ' + result.message);
      }
    } catch (error) {
      toast.error('Error loading applications: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-blue-50 to-slate-100 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Merchant Applications
          </h1>
          {isAdmin && (
            <Button 
              onClick={handleLoadApplications}
              variant="outline"
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
            >
              🔄 Load Applications
            </Button>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <AdminApplicationList />
        </div>
      </div>
    </div>
  );
};

export default Admin;
