import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/layout/Logo';
import MobileMenu from '@/components/layout/MobileMenu';
import DesktopNav from '@/components/layout/DesktopNav';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const { profile, logout, loading } = useAuth();

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

  // Use black text regardless of page with white background
  const getTextColor = () => {
    if (isDarkMode) {
      return 'text-white';
    }
    return 'text-black';
  };

  // Use white background regardless of page
  const getBgColor = () => {
    if (isDarkMode) {
      return 'bg-black';
    }
    return 'bg-white';
  };

  // Apply different styles based on scroll state
  const navbarClasses = `w-full max-w-[90rem] rounded-lg ${getBgColor()} transition-all duration-300 ${
    scrolled ? 'shadow-md' : ''
  }`;

  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-4 px-4 md:px-6 lg:px-8">
      <nav className={navbarClasses}>
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8 transition-all duration-300">
          {/* Logo */}
          <Logo textColor={getTextColor()} />
          
          {/* Desktop Navigation */}
          <DesktopNav navLinks={navLinks} textColor={getTextColor()} />

          {/* Profile/Logout or Auth link on right */}
          <div className="flex items-center gap-4">
            {!loading && profile && (
              <>
                {profile.role === "admin" ? (
                  <NavLink to="/admin" className="font-semibold">Admin</NavLink>
                ) : (
                  <NavLink to="/dashboard" className="font-semibold">Dashboard</NavLink>
                )}
                <button 
                  onClick={logout}
                  className={`text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${getTextColor()}`}
                >
                  Logout
                </button>
              </>
            )}
            {!loading && !profile && (
              <NavLink to="/auth" className={`font-semibold ${getTextColor()}`}>Login</NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden h-full flex items-center">
            <MobileMenu navLinks={navLinks} isHomePage={isHomePage} scrolled={scrolled} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
