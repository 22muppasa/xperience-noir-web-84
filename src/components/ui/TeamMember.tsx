
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Linkedin, Twitter, Mail } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  className?: string;
}

const TeamMember = ({ 
  name, 
  role, 
  bio, 
  image, 
  socialLinks,
  className 
}: TeamMemberProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={cn(
      "bg-white rounded-lg overflow-hidden transition-all duration-300 group hover-scale",
      className
    )}>
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-medium">{name}</h3>
        <p className="text-gray-500 mb-3">{role}</p>
        
        <div className="relative">
          <p className={`text-gray-700 mb-4 transition-all duration-300 ${
            isExpanded ? '' : 'line-clamp-3'
          }`}>
            {bio}
          </p>
          
          {bio.length > 140 && !isExpanded && (
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent" />
          )}
          
          {bio.length > 140 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium hover:underline focus:outline-none"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        
        {socialLinks && (
          <div className="flex gap-3 mt-4">
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label={`${name}'s LinkedIn Profile`}
              >
                <Linkedin size={18} />
              </a>
            )}
            {socialLinks.twitter && (
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label={`${name}'s Twitter Profile`}
              >
                <Twitter size={18} />
              </a>
            )}
            {socialLinks.email && (
              <a 
                href={`mailto:${socialLinks.email}`}
                className="text-gray-600 hover:text-black transition-colors"
                aria-label={`Email ${name}`}
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMember;
