
import React from 'react';
import TeamMember from '@/components/ui/TeamMember';

interface TeamMemberData {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const TeamSection = () => {
  const teamMembers: TeamMemberData[] = [
    {
      id: 1,
      name: "Adam Lueken",
      role: "Founder & CEO",
      bio: "I lead initiatives to run STEM camps and connect high school students with real-world software development opportunities. My role focuses on fostering innovation, mentoring future technologists, and bridging the gap between education and professional development through impactful programs and partnerships.",
      image: "https://i.ibb.co/d4CyCjFS/lueken-6996936c3bc63b6c7e62.jpg",
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/adam-lueken-37455a8/",
        email: "adam.lueken@d128.org"
      }
    },
    {
      id: 2,
      name: "Lorem Ipsum",
      role: "Head of Education",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=600&q=80",
      socialLinks: {
        linkedin: "https://linkedin.com",
        email: "marcus@xperience.com"
      }
    },
    {
      id: 3,
      name: "Lorem Ipsum",
      role: "Director of Consulting",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&h=600&q=80",
      socialLinks: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        email: "sophia@xperience.com"
      }
    },
    {
      id: 4,
      name: "Lorem Ipsum",
      role: "Community Impact Manager",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&h=600&q=80",
      socialLinks: {
        linkedin: "https://linkedin.com",
        email: "david@xperience.com"
      }
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Leadership Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the passionate individuals who guide our organization's mission and vision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {teamMembers.map(member => (
            <TeamMember
              key={member.id}
              name={member.name}
              role={member.role}
              bio={member.bio}
              image={member.image}
              socialLinks={member.socialLinks}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
