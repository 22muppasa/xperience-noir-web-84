
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/layout/Logo';
import MobileMenu from '@/components/layout/MobileMenu';
import DesktopNav from '@/components/layout/DesktopNav';
import FloatingHamburger from '@/components/layout/FloatingHamburger';

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

  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-4 px-4 md:px-6 lg:px-8">
      {/* Full navbar when not scrolled */}
      {!scrolled ? (
        <nav className={`w-full max-w-[90rem] rounded-lg ${getBgColor()} transition-all duration-300`}>
          <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">
            {/* Logo */}
            <Logo textColor={getTextColor()} />
            
            {/* Desktop Navigation */}
            <DesktopNav navLinks={navLinks} textColor={getTextColor()} />

            {/* Mobile Menu Button */}
            <div className="md:hidden h-16 flex items-center">
              <MobileMenu navLinks={navLinks} isHomePage={isHomePage} />
            </div>
          </div>
        </nav>
      ) : (
        /* Floating hamburger menu when scrolled */
        <FloatingHamburger navLinks={navLinks} isHomePage={isHomePage} />
      )}
    </div>
  );
};

export default Navbar;
