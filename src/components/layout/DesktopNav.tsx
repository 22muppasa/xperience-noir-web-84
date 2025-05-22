
import { NavLink } from '@/components/layout/NavLink';

interface DesktopNavProps {
  navLinks: Array<{ name: string; path: string }>;
  textColor: string;
}

const DesktopNav = ({ navLinks, textColor }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={`text-sm lg:text-base font-medium button-hover font-poppins ${textColor} hover:text-${textColor.split('-')[1]}/70 transition-all duration-300`}
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
};

export default DesktopNav;
