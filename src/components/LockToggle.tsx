
import { Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

interface LockToggleProps {
  isLocked: boolean;
  toggleLock: () => void;
}

const LockToggle = ({ isLocked, toggleLock }: LockToggleProps) => {
  return (
    <motion.div
      className={`cursor-pointer flex flex-col items-center justify-center`}
      onClick={toggleLock}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`p-8 rounded-full ${
          isLocked ? 'bg-emerald-500' : 'bg-amber-400'
        } shadow-lg transition-colors duration-300`}
        initial={{ rotate: 0 }}
        animate={{ rotate: isLocked ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        {isLocked ? (
          <Lock className="w-16 h-16 md:w-24 md:h-24 text-white" strokeWidth={1.5} />
        ) : (
          <Unlock className="w-16 h-16 md:w-24 md:h-24 text-white" strokeWidth={1.5} />
        )}
      </motion.div>
      <p className="mt-4 text-lg font-medium text-slate-700">
        {isLocked ? 'Greenlist Active' : 'Greenlist Inactive'}
      </p>
    </motion.div>
  );
};

export default LockToggle;
