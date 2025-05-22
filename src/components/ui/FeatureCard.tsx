
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkText: string;
  linkPath: string;
  hoverText: string;
}

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  linkText, 
  linkPath, 
  hoverText 
}: FeatureCardProps) => {
  return (
    <div className="feature-card-wrapper">
      <div className="feature-card">
        <div className="content-wrapper z-10 relative w-full h-full flex flex-col items-center justify-center p-8 text-white">
          <div className="w-14 h-14 bg-white/20 text-white flex items-center justify-center rounded-2xl mb-6">
            <Icon size={24} />
          </div>
          <h3 className="text-2xl font-medium mb-4">{title}</h3>
          <p className="text-gray-300 mb-6 text-center">
            {description}
          </p>
          <Link to={linkPath} className="inline-flex items-center font-medium button-hover text-white">
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
