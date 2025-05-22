
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

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

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-4 px-4 md:px-6 lg:px-8">
      {/* Full navbar when not scrolled */}
      {!scrolled ? (
        <nav className={`w-full max-w-[90rem] rounded-lg ${getBgColor()} transition-all duration-300`}>
          <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">
            {/* Logo */}
            <Link 
              to="/" 
              className={`text-2xl md:text-3xl font-bold font-poppins ${getTextColor()} transition-all duration-300`}
            >
              <span className="tracking-tighter">XPerience</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm lg:text-base font-medium button-hover font-poppins ${getTextColor()} hover:text-${getTextColor().split('-')[1]}/70 transition-all duration-300`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button - making height match navbar height */}
            <div className="md:hidden h-16 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                className={`h-16 w-16 p-1 rounded-full flex items-center justify-center ${getBgColor()} ${
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
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className={`md:hidden ${getBgColor()} border-t animate-fade-in rounded-b-lg overflow-hidden`}>
              <div className="container py-4 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 text-base rounded-xl transition-colors font-poppins ${
                      isDarkMode || isHomePage 
                        ? 'text-white hover:bg-white/10' 
                        : 'hover:bg-black/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      ) : (
        /* Use Drawer for floating hamburger menu when scrolled for better mobile UX */
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle menu"
              className={`h-16 w-16 rounded-full shadow-lg flex items-center justify-center ${getBgColor()} ${
                isDarkMode || isHomePage 
                  ? 'border-white/20 hover:bg-black/80 text-white' 
                  : 'border-black/10 hover:bg-gray-100 text-black'
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
          </DrawerTrigger>
          <DrawerContent className={`${getBgColor()} border-t-0`}>
            <DrawerHeader className="text-left">
              <DrawerTitle className={`text-2xl font-bold font-poppins ${getTextColor()}`}>
                <Link to="/" onClick={() => setIsOpen(false)}>
                  <span className="tracking-tighter">XPerience</span>
                </Link>
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-3 text-base rounded-xl transition-colors font-poppins ${
                    isDarkMode || isHomePage 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-black hover:bg-black/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default Navbar;
