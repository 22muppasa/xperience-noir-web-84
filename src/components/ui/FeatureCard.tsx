
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
      <div className="card">
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
      <style jsx>{`
        .feature-card-wrapper {
          perspective: 1000px;
        }
        .card {
          position: relative;
          width: 100%;
          height: 380px;
          background: mediumturquoise;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          font-weight: bold;
          border-radius: 15px;
          cursor: pointer;
        }
        .card::before,
        .card::after {
          position: absolute;
          content: "";
          width: 20%;
          height: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          font-weight: bold;
          background-color: lightblue;
          transition: all 0.5s;
        }
        .card::before {
          top: 0;
          right: 0;
          border-radius: 0 15px 0 100%;
        }
        .card::after {
          bottom: 0;
          left: 0;
          border-radius: 0 100% 0 15px;
        }
        .card:hover::before,
        .card:hover::after {
          width: 100%;
          height: 100%;
          border-radius: 15px;
          transition: all 0.5s;
        }
        .card:hover::after {
          content: "${props => props.hoverText}";
        }
      `}</style>
    </div>
  );
};

export default FeatureCard;
