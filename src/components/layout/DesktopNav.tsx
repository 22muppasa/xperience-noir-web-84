
import { NavLink } from '@/components/layout/NavLink';

interface DesktopNavProps {
  navLinks: Array<{ name: string; path: string }>;
  textColor: string;
}

const DesktopNav = ({ navLinks, textColor }: DesktopNavProps) => {
  return (
    <div className="flex items-center space-x-4">
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={`text-sm font-medium button-hover font-poppins ${textColor} hover:text-${textColor.split('-')[1]}/70 transition-all duration-300 whitespace-nowrap`}
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
};

export default DesktopNav;
