
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut } from 'lucide-react';

interface MobileMenuProps {
  navLinks: Array<{ name: string; path: string }>;
  isHomePage: boolean;
  scrolled?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  user?: any;
  userRole?: string;
  onSignOut?: () => void;
}

const MobileMenu = ({ 
  navLinks, 
  isHomePage, 
  scrolled = false, 
  isOpen = false, 
  onOpenChange,
  user,
  userRole,
  onSignOut
}: MobileMenuProps) => {
  const { isDarkMode } = useTheme();

  // Determine the correct text color based on both page and theme
  const getTextColor = () => {
    if (isDarkMode) {
      return 'text-white';
    }
    return 'text-gray-900';
  };

  // Determine the correct background color based on both page and theme
  const getBgColor = () => {
    if (isDarkMode) {
      return 'bg-gray-900';
    }
    return 'bg-white';
  };

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Toggle menu"
          className="h-10 w-10 p-0 hover:bg-gray-100 rounded-lg"
        >
          <div className="w-6 h-6 flex flex-col items-center justify-center gap-1">
            <span 
              className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-transform duration-300 ${
                isOpen ? 'transform rotate-45 translate-y-1.5' : ''
              }`}
            ></span>
            <span 
              className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-opacity duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span 
              className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-transform duration-300 ${
                isOpen ? 'transform -rotate-45 -translate-y-1.5' : ''
              }`}
            ></span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={`${getBgColor()} border-none w-80`}>
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-2xl font-bold font-poppins ${getTextColor()} mb-8`}
            onClick={() => handleOpenChange(false)}
          >
            <span className="tracking-tighter">XPerience</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex flex-col space-y-2 mb-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-3 text-base rounded-xl transition-colors font-poppins ${getTextColor()} hover:bg-gray-100`}
                onClick={() => handleOpenChange(false)}
                style={{ 
                  opacity: 0,
                  animation: isOpen ? `fadeIn 300ms ease-out forwards ${index * 50}ms` : 'none'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="mt-auto space-y-3">
            {user ? (
              <>
                <Link
                  to={userRole === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => handleOpenChange(false)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onSignOut) onSignOut();
                    handleOpenChange(false);
                  }}
                  className="flex items-center justify-center w-full space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => handleOpenChange(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="flex items-center justify-center w-full px-4 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                  onClick={() => handleOpenChange(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
