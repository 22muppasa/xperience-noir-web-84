
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, X } from 'lucide-react';

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
          className="h-10 w-10 p-0 hover:bg-gray-100/80 rounded-lg transition-all duration-200 group"
        >
          <div className="w-6 h-6 flex flex-col items-center justify-center gap-1.5 relative">
            {/* Top line */}
            <span 
              className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-in-out transform-gpu ${
                isOpen ? 'rotate-45 translate-y-2' : 'group-hover:w-6'
              }`}
            />
            {/* Middle line */}
            <span 
              className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-0 scale-0' : 'group-hover:w-4'
              }`}
            />
            {/* Bottom line */}
            <span 
              className={`block w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ease-in-out transform-gpu ${
                isOpen ? '-rotate-45 -translate-y-2' : 'group-hover:w-6'
              }`}
            />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl"
      >
        <div className="flex flex-col h-full py-6">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/" 
              className="text-2xl font-bold font-poppins text-gray-900 tracking-tight"
              onClick={() => handleOpenChange(false)}
            >
              XPerience
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col space-y-1 mb-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className="group px-4 py-4 text-base rounded-xl transition-all duration-200 font-poppins text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 relative overflow-hidden animate-fade-in"
                onClick={() => handleOpenChange(false)}
                style={{ 
                  animationDelay: `${index * 50 + 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl" />
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="mt-auto space-y-3">
            {user ? (
              <div 
                className="space-y-3 animate-fade-in"
                style={{ 
                  animationDelay: '600ms',
                  animationFillMode: 'forwards'
                }}
              >
                <Link
                  to={userRole === 'admin' ? '/admin' : '/customer'}
                  className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white/50 hover:bg-white hover:border-gray-300 transition-all duration-200 group"
                  onClick={() => handleOpenChange(false)}
                >
                  <LayoutDashboard className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  <span>Dashboard</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onSignOut) onSignOut();
                    handleOpenChange(false);
                  }}
                  className="flex items-center justify-center w-full space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 group"
                >
                  <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div 
                className="space-y-3 animate-fade-in"
                style={{ 
                  animationDelay: '600ms',
                  animationFillMode: 'forwards'
                }}
              >
                <Link
                  to="/auth"
                  className="flex items-center justify-center w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white/50 hover:bg-white hover:border-gray-300 transition-all duration-200"
                  onClick={() => handleOpenChange(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="flex items-center justify-center w-full px-4 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
                  onClick={() => handleOpenChange(false)}
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
