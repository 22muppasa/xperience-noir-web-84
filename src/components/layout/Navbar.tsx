
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isDarkMode } = useTheme();

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

  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-4 px-4">
      {/* Full navbar when not scrolled */}
      {!scrolled ? (
        <nav className={`w-full max-w-6xl rounded-lg ${getBgColor()}`}>
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            {/* Logo */}
            <Link 
              to="/" 
              className={`text-2xl font-bold font-poppins ${getTextColor()}`}
            >
              <span className="tracking-tighter">XPerience</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium button-hover font-poppins ${getTextColor()} hover:text-${getTextColor().split('-')[1]}/70`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button - making height match navbar height (h-16) */}
            <div className="md:hidden h-16 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className={`h-16 w-16 p-1 rounded-full flex items-center justify-center ${getBgColor()} ${
                  isDarkMode || isHomePage 
                    ? 'text-white hover:bg-white/20' 
                    : 'hover:bg-black/5'
                }`}
              >
                {isOpen ? <X size={40} /> : <Menu size={40} />}
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
        /* Hamburger menu only when scrolled - adjusted for height and color */
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`h-16 w-16 rounded-full shadow-lg flex items-center justify-center ${getBgColor()} ${
              isDarkMode || isHomePage 
                ? 'border-white/20 hover:bg-black/80 text-white' 
                : 'border-black/10 hover:bg-gray-100 text-black'
            }`}
          >
            {isOpen ? <X size={40} /> : <Menu size={40} />}
          </Button>
          
          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className={`absolute top-16 right-0 w-64 mt-2 ${getBgColor()} shadow-lg rounded-lg border animate-fade-in overflow-hidden`}>
              <div className="py-4 flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className={`px-4 py-2 text-lg font-bold font-poppins ${getTextColor()} mb-2`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="tracking-tighter">XPerience</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 text-base transition-colors font-poppins ${
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
        </div>
      )}
    </div>
  );
};

export default Navbar;
