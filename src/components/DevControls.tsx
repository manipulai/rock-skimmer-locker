import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';

const DevControls = () => {
  const { isAdmin, setIsAdmin } = useAdmin();
  const navigate = useNavigate();

  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  const handleAdminToggle = () => {
    setIsAdmin(!isAdmin);
    toast.success(`Admin mode ${!isAdmin ? 'enabled' : 'disabled'}`);
    
    // If enabling admin mode, navigate to admin page
    if (!isAdmin) {
      navigate('/admin');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <Button
        onClick={handleAdminToggle}
        variant="outline"
        className={`${
          isAdmin 
            ? 'bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
        }`}
      >
        👑 Admin: {isAdmin ? 'ON' : 'OFF'}
      </Button>
    </div>
  );
};

export default DevControls;
