
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

const Navbar = () => {
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

            {/* Mobile Menu Button - moved to the right side */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Menu"
                    className={`p-1 ${
                      isDarkMode || isHomePage 
                        ? 'text-white hover:bg-white/20' 
                        : 'text-black hover:bg-black/5'
                    }`}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className={`${getBgColor()} overflow-y-auto`}>
                  <SheetHeader>
                    <SheetTitle className={`text-2xl font-bold font-poppins ${getTextColor()}`}>
                      <Link to="/">
                        <span className="tracking-tighter">XPerience</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="py-6 flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`px-4 py-3 text-base rounded-xl transition-colors font-poppins ${
                          isDarkMode || isHomePage 
                            ? 'text-white hover:bg-white/10' 
                            : 'text-black hover:bg-black/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      ) : (
        /* Floating hamburger menu when scrolled */
        <div className="flex justify-end w-full">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Menu"
                className={`h-16 w-16 rounded-full shadow-lg flex items-center justify-center ${getBgColor()} ${
                  isDarkMode || isHomePage 
                    ? 'border-white/20 hover:bg-black/80 text-white' 
                    : 'border-black/10 hover:bg-gray-100 text-black'
                }`}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`${getBgColor()} overflow-y-auto`}>
              <SheetHeader>
                <SheetTitle className={`text-2xl font-bold font-poppins ${getTextColor()}`}>
                  <Link to="/">
                    <span className="tracking-tighter">XPerience</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="py-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-3 text-base rounded-xl transition-colors font-poppins ${
                      isDarkMode || isHomePage 
                        ? 'text-white hover:bg-white/10' 
                        : 'text-black hover:bg-black/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};

export default Navbar;
