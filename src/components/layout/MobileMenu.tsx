
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/layout/NavLink';

interface MobileMenuProps {
  navLinks: Array<{ name: string; path: string }>;
  isHomePage: boolean;
  scrolled?: boolean;
}

const MobileMenu = ({ navLinks, isHomePage, scrolled = false }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  // Determine the correct text color based on both page and theme
  const getTextColor = () => {
    if (isDarkMode) {
      return 'text-white';
    }
    return isHomePage ? 'text-white' : 'text-black';
  };

  // Determine the correct background color based on both page and theme
  const getBgColor = () => {
    if (isDarkMode) {
      return 'bg-black';
    }
    return isHomePage ? 'bg-black' : 'bg-white';
  };

  // Adjust button height to match navbar height
  const buttonSize = scrolled ? 'h-12 w-12' : 'h-16 w-16';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Toggle menu"
          className={`${buttonSize} p-1 rounded-full flex items-center justify-center ${getBgColor()} ${
            isDarkMode || isHomePage 
              ? 'text-white hover:bg-white/20' 
              : 'hover:bg-black/5'
          }`}
        >
          <div className="w-8 flex flex-col items-center justify-center gap-1.5">
            <span 
              className={`block w-8 h-1 rounded-full transition-transform duration-300 ${
                isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
              } ${isOpen ? 'transform rotate-45 translate-y-2.5' : ''}`}
            ></span>
            <span 
              className={`block w-8 h-1 rounded-full transition-opacity duration-300 ${
                isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
              } ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            ></span>
            <span 
              className={`block w-8 h-1 rounded-full transition-transform duration-300 ${
                isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
              } ${isOpen ? 'transform -rotate-45 -translate-y-2.5' : ''}`}
            ></span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={`${getBgColor()} border-none`}>
        <div className="container py-4 flex flex-col space-y-4">
          <Link 
            to="/" 
            className={`text-2xl font-bold font-poppins ${getTextColor()} mb-4`}
            onClick={() => setIsOpen(false)}
          >
            <span className="tracking-tighter">XPerience</span>
          </Link>
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 text-base rounded-xl transition-colors font-poppins ${
                isDarkMode || isHomePage 
                  ? 'text-white hover:bg-white/10' 
                  : 'hover:bg-black/5'
              }`}
              onClick={() => setIsOpen(false)}
              style={{ 
                opacity: 0,
                animation: isOpen ? `fadeIn 300ms ease-out forwards ${index * 30}ms` : 'none'
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
