
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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

  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-4 px-4">
      {/* Full navbar when not scrolled */}
      {!scrolled ? (
        <nav className={`w-full max-w-6xl rounded-lg ${isHomePage ? 'bg-black' : 'bg-white'}`}>
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            {/* Logo */}
            <Link 
              to="/" 
              className={`text-2xl font-bold font-poppins ${isHomePage ? 'text-white' : 'text-black'}`}
            >
              <span className="tracking-tighter">XPerience</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium button-hover font-poppins ${
                    isHomePage ? 'text-white hover:text-white/70' : 'hover:text-black/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                className={`p-1 rounded-full ${
                  isHomePage 
                    ? 'text-white hover:bg-white/20' 
                    : 'hover:bg-black/5'
                }`}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className={`md:hidden ${isHomePage ? 'bg-black' : 'bg-white'} border-t animate-fade-in rounded-b-lg overflow-hidden`}>
              <div className="container py-4 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 text-base rounded-xl transition-colors font-poppins ${
                      isHomePage 
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
        /* Hamburger menu only when scrolled */
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`h-10 w-10 rounded-full shadow-lg ${
              isHomePage 
                ? 'bg-black border-white/20 hover:bg-black/80 text-white' 
                : 'bg-white border-black/10 hover:bg-gray-100 text-black'
            }`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className={`absolute top-12 right-0 w-64 mt-2 ${isHomePage ? 'bg-black' : 'bg-white'} shadow-lg rounded-lg border animate-fade-in overflow-hidden`}>
              <div className="py-4 flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className={`px-4 py-2 text-lg font-bold font-poppins ${isHomePage ? 'text-white' : 'text-black'} mb-2`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="tracking-tighter">XPerience</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 text-base transition-colors font-poppins ${
                      isHomePage 
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
