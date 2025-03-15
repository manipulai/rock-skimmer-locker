
import { motion } from 'framer-motion';

interface Rock {
  id: number;
  name: string;
  description: string;
  isGreenlisted: boolean;
  image: string;
}

interface RockListProps {
  isGreenlisted: boolean;
}

const rocks: Rock[] = [
  {
    id: 1,
    name: 'Flat Slate',
    description: 'Perfectly flat and smooth - ideal for maximum skips.',
    isGreenlisted: true,
    image: '🪨',
  },
  {
    id: 2,
    name: 'Smooth Quartz',
    description: 'Round and smooth with good weight distribution.',
    isGreenlisted: true,
    image: '🪨',
  },
  {
    id: 3,
    name: 'River Pebble',
    description: 'Naturally polished by water - great for beginners.',
    isGreenlisted: true,
    image: '🪨',
  },
  {
    id: 4,
    name: 'Sandstone Disc',
    description: 'Light and wide surface area for impressive skips.',
    isGreenlisted: true,
    image: '🪨',
  },
  {
    id: 5,
    name: 'Limestone Chunk',
    description: 'Too heavy and irregular - sinks immediately.',
    isGreenlisted: false,
    image: '🪨',
  },
  {
    id: 6,
    name: 'Granite Boulder',
    description: 'Way too large for skimming - you might hurt yourself!',
    isGreenlisted: false,
    image: '🪨',
  },
  {
    id: 7,
    name: 'Pumice Stone',
    description: 'Too light and floats - not suitable for skimming.',
    isGreenlisted: false,
    image: '🪨',
  },
  {
    id: 8,
    name: 'Jagged Flint',
    description: 'Sharp edges make this dangerous to handle and throw.',
    isGreenlisted: false,
    image: '🪨',
  },
];

const RockList = ({ isGreenlisted }: RockListProps) => {
  const filteredRocks = isGreenlisted
    ? rocks.filter((rock) => rock.isGreenlisted)
    : rocks;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRocks.map((rock) => (
        <motion.div
          key={rock.id}
          className={`p-6 rounded-lg shadow-md ${
            rock.isGreenlisted
              ? 'bg-white border-l-4 border-emerald-500'
              : 'bg-white border-l-4 border-amber-400'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-slate-800">{rock.name}</h3>
            <span className="text-3xl">{rock.image}</span>
          </div>
          <p className="text-slate-600">{rock.description}</p>
          <div className="mt-4">
            <span
              className={`inline-block px-3 py-1 text-sm rounded-full ${
                rock.isGreenlisted
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {rock.isGreenlisted ? 'Greenlist Approved' : 'Not Recommended'}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RockList;
