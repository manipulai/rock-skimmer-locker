import { Button } from '@/components/ui/button';
import { seedData } from '@/lib/seedData';
import { toast } from 'sonner';

const DevSeedButton = () => {
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  const handleSeed = async () => {
    const result = await seedData();
    if (result.success) {
      toast.success('Sample data seeded successfully');
    } else {
      toast.error('Failed to seed data: ' + result.message);
    }
  };

  return (
    <Button
      onClick={handleSeed}
      variant="outline"
      className="fixed bottom-4 right-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
    >
      🌱 Seed Data
    </Button>
  );
};

export default DevSeedButton;