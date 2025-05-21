
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
    { name: 'Impact', path: '/impact' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Social Hub', path: '/social-hub' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-4 px-4">
      <nav
        className={`w-full max-w-6xl transition-all duration-300 rounded-2xl ${
          isHomePage
            ? scrolled 
              ? 'bg-black/40 backdrop-blur-md shadow-lg' 
              : 'bg-black/20 backdrop-blur-sm'
            : scrolled 
              ? 'bg-white/90 backdrop-blur-md shadow-lg' 
              : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-xl font-semibold">
            <span className="sr-only">XPerience</span>
            <img src="/placeholder.svg" alt="XPerience Logo" className={`h-8 ${isHomePage ? 'filter brightness-0 invert' : ''}`} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium button-hover ${
                  isHomePage ? 'text-white hover:text-white/70' : 'hover:text-black/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
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
          <div className={`md:hidden ${isHomePage ? 'bg-black/50' : 'bg-white'} border-t animate-fade-in rounded-b-2xl overflow-hidden`}>
            <div className="container py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-base rounded-xl transition-colors ${
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
    </div>
  );
};

export default Navbar;
