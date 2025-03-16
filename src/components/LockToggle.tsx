
import { motion } from 'framer-motion';
import { useState } from 'react';

interface LockToggleProps {
  isLocked: boolean;
  toggleLock: () => void;
}

const LockToggle = ({ isLocked, toggleLock }: LockToggleProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className={`cursor-pointer flex flex-col items-center justify-center`}
      onClick={toggleLock}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`p-1.5 rounded-full ${
          isLocked ? 'bg-emerald-200' : 'bg-amber-200'
        } shadow-lg transition-colors duration-300`}
        initial={{ rotate: 0 }}
        animate={{ rotate: isLocked ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        {imageError ? (
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full" />
        ) : (
          <img
            src="./logo.png"
            alt="Toggle Logo"
            className="w-16 h-16 md:w-24 md:h-24"
            onError={() => setImageError(true)}
          />
        )}
      </motion.div>
      <p className="mt-4 text-lg font-medium text-slate-700">
        {isLocked ? 'Greenlist Active' : 'Greenlist Inactive'}
      </p>
    </motion.div>
  );
};

export default LockToggle;
