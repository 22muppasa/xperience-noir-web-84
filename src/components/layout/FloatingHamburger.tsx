
import MobileMenu from '@/components/layout/MobileMenu';

interface FloatingHamburgerProps {
  navLinks: Array<{ name: string; path: string }>;
  isHomePage: boolean;
}

const FloatingHamburger = ({ navLinks, isHomePage }: FloatingHamburgerProps) => {
  return (
    <div className="absolute top-4 right-4 md:right-6 lg:right-8">
      <MobileMenu 
        navLinks={navLinks} 
        isHomePage={isHomePage}
        scrolled={true} 
      />
    </div>
  );
};

export default FloatingHamburger;
