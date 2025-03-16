
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LockToggle from '@/components/LockToggle';

const Index = () => {
  const [isLocked, setIsLocked] = useState(true);

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  return (
    <div className="h-screen pt-24 bg-gradient-to-b from-blue-50 to-slate-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 text-center">
        Always Wear Protection
      </h1>
      <p className="text-slate-500 text-sm md:text-base max-w-2xl text-center mb-8">
        {isLocked 
          ? "Showing only greenlist approved rocks for perfect skimming experience." 
          : "All rocks shown. Toggle the lock to see only the best skimming rocks."}
      </p>
      
      <div className="mb-8">
        <LockToggle isLocked={isLocked} toggleLock={toggleLock} />
      </div>
      
      <Link 
        to="/rocks" 
        className="px-8 py-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 text-lg font-semibold shadow-lg"
      >
        View All Rocks
      </Link>
    </div>
  );
};

export default Index;
