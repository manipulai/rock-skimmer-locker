import RockList from '@/components/RockList';
import { Link } from 'react-router-dom';

const Rocks = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-blue-50 to-slate-100 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Available Rocks
          </h1>
          <Link 
            to="/" 
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
        <RockList isGreenlisted={true} />
      </div>
    </div>
  );
};

export default Rocks;