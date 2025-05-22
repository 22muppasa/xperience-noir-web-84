
import { Link } from 'react-router-dom';

interface LogoProps {
  textColor: string;
}

const Logo = ({ textColor }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className={`text-2xl md:text-3xl font-bold font-poppins ${textColor} transition-all duration-300`}
    >
      <span className="tracking-tighter">XPerience</span>
    </Link>
  );
};

export default Logo;
