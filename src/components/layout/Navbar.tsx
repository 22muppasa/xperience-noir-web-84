
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/layout/Logo';
import DesktopNav from '@/components/layout/DesktopNav';

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

  // Apply different styles based on scroll state
  const navbarClasses = `w-full max-w-[90rem] rounded-lg ${getBgColor()} transition-all duration-300 ${
    scrolled ? 'shadow-md' : ''
  }`;

  return (
    <div className="fixed top-0 z-50 w-full flex justify-center pt-4 px-4 md:px-6 lg:px-8">
      <nav className={navbarClasses}>
        <div className={`container mx-auto flex ${scrolled ? 'h-12 md:h-14' : 'h-16 md:h-20'} items-center justify-between px-4 md:px-6 lg:px-8 transition-all duration-300`}>
          {/* Logo */}
          <Logo textColor={getTextColor()} />
          
          {/* Navigation - Show desktop nav regardless of screen size */}
          <div className={`flex items-center space-x-2 md:space-x-4 lg:space-x-8 overflow-x-auto ${isMobile ? 'text-xs' : ''}`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={`whitespace-nowrap font-medium button-hover font-poppins ${getTextColor()} hover:opacity-80 transition-all duration-300 py-2`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
