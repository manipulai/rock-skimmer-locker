
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getRocks } from '@/lib/api';
import type { Rock } from '@/types/database';

interface RockListProps {
  isGreenlisted: boolean;
}

const RockList = ({ isGreenlisted }: RockListProps) => {
  const { data: rocks, isLoading, error } = useQuery({
    queryKey: ['rocks', isGreenlisted],
    queryFn: async () => {
      try {
        console.log('Fetching rocks with isGreenlisted:', isGreenlisted);
        const data = await getRocks(isGreenlisted);
        console.log('Fetched rocks:', data);
        return data;
      } catch (err) {
        console.error('Error fetching rocks:', err);
        throw err;
      }
    }
  });

  if (isLoading) {
    return <div className="text-center">Loading rocks...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading rocks: {error.message}
      </div>
    );
  }

  if (!rocks || rocks.length === 0) {
    return (
      <div className="text-center text-slate-500">
        No rocks found. {isGreenlisted ? 'Try viewing all rocks instead of just greenlisted ones.' : ''}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rocks.map((rock: Rock) => (
        <motion.div
          key={rock.id}
          className={`p-6 rounded-lg shadow-md ${
            rock.is_greenlisted
              ? 'bg-white border-l-4 border-emerald-500'
              : 'bg-white border-l-4 border-amber-400'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-slate-800">{rock.name}</h3>
            <span className="text-3xl">🪨</span>
          </div>
          <p className="text-slate-600">{rock.description}</p>
          <div className="mt-4">
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full ${
                rock.is_greenlisted
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {rock.is_greenlisted ? 'Greenlist Approved' : 'Not Recommended'}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RockList;
