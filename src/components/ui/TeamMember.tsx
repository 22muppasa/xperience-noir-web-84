
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
      "flex flex-col items-center text-center",
      className
    )}>
      {/* Circular image */}
      <Avatar className="h-40 w-40 mb-4">
        <AvatarImage 
          src={image} 
          alt={name}
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <AvatarFallback className="bg-gray-100 text-gray-400">
          {name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      {/* Text content */}
      <div className="w-full">
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
          <div className="flex justify-center gap-3 mt-4">
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
