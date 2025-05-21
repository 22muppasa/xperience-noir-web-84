
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Programs', path: '/programs' },
    { name: 'Consulting', path: '/consulting' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Social Hub', path: '/social-hub' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

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

  // Render the compact navbar when scrolled
  if (scrolled) {
    return (
      <div className="fixed top-0 z-50 w-full flex justify-end pt-4 px-4">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`h-12 w-12 sm:h-16 sm:w-16 lg:h-18 lg:w-18 xl:h-20 xl:w-20 rounded-full shadow-lg flex items-center justify-center ${getBgColor()} ${
              isDarkMode || isHomePage 
                ? 'border-white/20 hover:bg-black/80 text-white' 
                : 'border-black/10 hover:bg-gray-100 text-black'
            }`}
          >
            <div className="w-6 sm:w-8 lg:w-10 xl:w-12 flex flex-col items-center justify-center gap-1 lg:gap-1.5 xl:gap-2">
              <span 
                className={`block w-6 sm:w-8 lg:w-10 xl:w-12 h-0.5 sm:h-1 lg:h-1.5 xl:h-2 rounded-full transition-transform duration-300 ${
                  isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
                } ${isOpen ? 'transform rotate-45 translate-y-1.5 sm:translate-y-2.5 lg:translate-y-3 xl:translate-y-3.5' : ''}`}
              ></span>
              <span 
                className={`block w-6 sm:w-8 lg:w-10 xl:w-12 h-0.5 sm:h-1 lg:h-1.5 xl:h-2 rounded-full transition-opacity duration-300 ${
                  isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
                } ${isOpen ? 'opacity-0' : 'opacity-100'}`}
              ></span>
              <span 
                className={`block w-6 sm:w-8 lg:w-10 xl:w-12 h-0.5 sm:h-1 lg:h-1.5 xl:h-2 rounded-full transition-transform duration-300 ${
                  isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
                } ${isOpen ? 'transform -rotate-45 -translate-y-1.5 sm:-translate-y-2.5 lg:-translate-y-3 xl:-translate-y-3.5' : ''}`}
              ></span>
            </div>
          </Button>
          
          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div 
              className={`absolute top-12 sm:top-16 lg:top-18 xl:top-20 right-0 w-56 sm:w-64 lg:w-72 xl:w-80 mt-2 ${getBgColor()} shadow-lg rounded-lg border animate-fade-in overflow-hidden`}
              onClick={() => setIsOpen(false)}
            >
              <div className="py-4 flex flex-col space-y-1 sm:space-y-2">
                <Link 
                  to="/" 
                  className={`px-4 py-2 text-base sm:text-lg lg:text-xl xl:text-2xl font-bold font-poppins ${getTextColor()} mb-2`}
                >
                  <span className="tracking-tighter">XPerience</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 text-sm sm:text-base lg:text-lg xl:text-xl transition-colors font-poppins ${
                      isDarkMode || isHomePage 
                        ? 'text-white hover:bg-white/10' 
                        : 'hover:bg-black/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full expanded navbar when not scrolled
  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-2 sm:pt-4 lg:pt-6 xl:pt-8 px-2 sm:px-4 lg:px-6 xl:px-8">
      <nav className={`w-full max-w-6xl lg:max-w-7xl xl:max-w-screen-2xl rounded-lg ${getBgColor()} shadow-sm`}>
        <div className="container mx-auto flex h-12 sm:h-16 lg:h-20 xl:h-24 items-center justify-between px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold font-poppins ${getTextColor()}`}
          >
            <span className="tracking-tighter">XPerience</span>
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="space-x-2 lg:space-x-4 xl:space-x-6">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuLink
                      asChild
                      className={`text-sm lg:text-base xl:text-lg font-medium button-hover font-poppins ${getTextColor()} hover:text-${getTextColor().split('-')[1]}/70 px-2 py-2 lg:px-3 lg:py-3 xl:px-4 xl:py-4`}
                    >
                      <Link to={link.path}>
                        {link.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden h-12 sm:h-16 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className={`h-12 sm:h-16 w-12 sm:w-16 p-1 rounded-full flex items-center justify-center ${getBgColor()} ${
                isDarkMode || isHomePage 
                  ? 'text-white hover:bg-white/20' 
                  : 'hover:bg-black/5'
              }`}
            >
              <div className="w-6 sm:w-8 flex flex-col items-center justify-center gap-1">
                <span 
                  className={`block w-6 sm:w-8 h-0.5 sm:h-1 rounded-full transition-transform duration-300 ${
                    isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
                  } ${isOpen ? 'transform rotate-45 translate-y-1.5 sm:translate-y-2.5' : ''}`}
                ></span>
                <span 
                  className={`block w-6 sm:w-8 h-0.5 sm:h-1 rounded-full transition-opacity duration-300 ${
                    isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
                  } ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                ></span>
                <span 
                  className={`block w-6 sm:w-8 h-0.5 sm:h-1 rounded-full transition-transform duration-300 ${
                    isDarkMode || isHomePage ? 'bg-white' : 'bg-black'
                  } ${isOpen ? 'transform -rotate-45 -translate-y-1.5 sm:-translate-y-2.5' : ''}`}
                ></span>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && isMobile && (
          <div className={`md:hidden ${getBgColor()} border-t animate-fade-in rounded-b-lg overflow-hidden`}>
            <div className="container py-3 flex flex-col space-y-2" onClick={() => setIsOpen(false)}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-sm rounded-xl transition-colors font-poppins ${
                    isDarkMode || isHomePage 
                      ? 'text-white hover:bg-white/10' 
                      : 'hover:bg-black/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
