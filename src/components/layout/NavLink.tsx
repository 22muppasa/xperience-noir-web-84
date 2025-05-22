
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const NavLink = ({ to, className = '', children, onClick }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};
