
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Programs', path: '/programs' },
    { name: 'Consulting', path: '/consulting' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Social Hub', path: '/social-hub' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo textColor="text-gray-900" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <DesktopNav navLinks={navLinks} textColor="text-gray-900" />

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={userRole === 'admin' ? '/admin' : '/dashboard'}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button, visible on small screens */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              className="text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <MobileMenu
            navLinks={navLinks}
            isHomePage={false}
            scrolled={false}
          />
          {/* Clicking outside will close the menu, for now just close when clicking anything inside - better UX to be improved later */}
          {/* Add a close overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ background: "rgba(0,0,0,0.1)" }}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;

