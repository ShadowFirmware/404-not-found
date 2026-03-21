import { Link } from 'react-router-dom';
import { LogOut, User, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                PauMatch
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link
                  to="/matching"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  <Heart className="h-6 w-6" />
                </Link>
                <Link
                  to="/chat"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  <MessageCircle className="h-6 w-6" />
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                >
                  <User className="h-6 w-6" />
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Cerrar sesión</span>
                </button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
