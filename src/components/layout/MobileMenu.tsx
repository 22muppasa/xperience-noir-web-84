
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LayoutDashboard, LogOut } from 'lucide-react';

interface MobileMenuProps {
  navLinks: Array<{ name: string; path: string }>;
  isHomePage: boolean;
  scrolled?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  userRole?: string;
  onSignOut: () => void;
}

const MobileMenu = ({ 
  navLinks, 
  isHomePage, 
  scrolled = false, 
  isOpen, 
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
    return isHomePage ? 'text-white' : 'text-gray-900';
  };

  // Determine the correct background color based on both page and theme
  const getBgColor = () => {
    if (isDarkMode) {
      return 'bg-gray-900';
    }
    return 'bg-white';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Toggle menu"
          className="p-2 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6 text-gray-900" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={`${getBgColor()} border-none w-80`}>
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <div className="mb-8">
            <Link 
              to="/" 
              className={`text-2xl font-bold font-poppins ${getTextColor()}`}
              onClick={() => onOpenChange(false)}
            >
              <span className="tracking-tighter">XPerience</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4 flex-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-3 text-lg rounded-xl transition-colors font-poppins ${
                  isDarkMode 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => onOpenChange(false)}
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
          <div className="border-t border-gray-200 pt-6 mt-6">
            {user ? (
              <div className="space-y-4">
                <Link 
                  to={userRole === 'admin' ? '/admin' : '/dashboard'}
                  className={`flex items-center px-4 py-3 text-lg rounded-xl transition-colors font-poppins ${
                    isDarkMode 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => onOpenChange(false)}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-lg py-3"
                  onClick={() => {
                    onSignOut();
                    onOpenChange(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link 
                  to="/auth"
                  className={`block px-4 py-3 text-lg rounded-xl transition-colors font-poppins text-center border ${
                    isDarkMode 
                      ? 'text-white border-white hover:bg-white/10' 
                      : 'text-gray-900 border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => onOpenChange(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth"
                  className="block px-4 py-3 text-lg rounded-xl transition-colors font-poppins text-center bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => onOpenChange(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
