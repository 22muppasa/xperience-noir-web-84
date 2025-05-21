
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

  // Split the navigation items into two groups for left and right sides
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

  const midpoint = Math.ceil(navLinks.length / 2);
  const leftNavLinks = navLinks.slice(0, midpoint);
  const rightNavLinks = navLinks.slice(midpoint);

  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-4 px-4">
      <nav
        className={`w-full max-w-6xl transition-all duration-300 rounded-lg ${
          isHomePage
            ? scrolled 
              ? 'bg-black shadow-lg' 
              : 'bg-black'
            : scrolled 
              ? 'bg-white shadow-lg' 
              : 'bg-white'
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left navigation items - visible only on desktop and when not scrolled */}
          <div className={`hidden ${scrolled ? 'lg:hidden' : 'lg:flex'} items-center space-x-6 flex-1 justify-end`}>
            {leftNavLinks.map((link) => (
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

          {/* Logo - centered */}
          <Link 
            to="/" 
            className={`text-xl font-semibold ${scrolled ? 'flex-1 lg:flex-none' : ''}`}
          >
            <span className="sr-only">XPerience</span>
            <div className="flex justify-center">
              <img src="/placeholder.svg" alt="XPerience Logo" className={`h-8 ${isHomePage ? 'filter brightness-0 invert' : ''}`} />
            </div>
          </Link>

          {/* Right navigation items - visible only on desktop and when not scrolled */}
          <div className={`hidden ${scrolled ? 'lg:hidden' : 'lg:flex'} items-center space-x-6 flex-1 justify-start`}>
            {rightNavLinks.map((link) => (
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

          {/* Mobile Navigation Button - visible on mobile or when scrolled */}
          <div className={`${scrolled ? '' : 'md:hidden lg:hidden'} flex justify-end flex-1 lg:flex-none`}>
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
