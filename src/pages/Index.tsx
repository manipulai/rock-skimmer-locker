
import { useState } from 'react';
import RockList from '@/components/RockList';
import LockToggle from '@/components/LockToggle';

const Index = () => {
  const [isLocked, setIsLocked] = useState(true);

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 text-center">
        Rock Skimmer Locker
      </h1>
      <p className="text-slate-600 text-lg md:text-xl max-w-2xl text-center mb-12">
        {isLocked 
          ? "Showing only greenlist approved rocks for perfect skimming experience." 
          : "All rocks shown. Toggle the lock to see only the best skimming rocks."}
      </p>
      
      <div className="mb-12">
        <LockToggle isLocked={isLocked} toggleLock={toggleLock} />
      </div>
      
      <div className="w-full max-w-4xl">
        <RockList isGreenlisted={isLocked} />
      </div>
    </div>
  );
};

export default Index;
