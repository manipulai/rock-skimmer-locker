import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isAdmin } = useAdmin();

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20"> {/* Reduced from h-24 to h-20 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {imageError ? (
                <span className="text-xl font-bold text-slate-800">Rock Skimmer</span>
              ) : (
                <img 
                  src="./logo.png" 
                  alt="Rock Skimmer Logo" 
                  className="h-16 w-auto" /* Reduced from h-20 to h-16 */
                  onError={() => setImageError(true)}
                />
              )}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/apply" className="text-slate-600 hover:text-slate-900">
              Become a Merchant
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-slate-600 hover:text-slate-900">
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/apply" 
                className="block px-3 py-2 text-slate-600 hover:text-slate-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Merchant
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 text-slate-600 hover:text-slate-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;