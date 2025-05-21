import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TeamMember from '@/components/ui/TeamMember';

const teamMembers = [
  {
    id: 1,
    name: "Lorem Ipsum",
    role: "Founder & CEO",
    bio: "Alexandra has over 15 years of experience in tech education. Before founding XPerience, she led digital transformation initiatives at major tech companies and educational institutions. She's passionate about making technology education accessible to everyone.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&h=600&q=80",
    socialLinks: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "alexandra@xperience.com"
    }
  },
  {
    id: 2,
    name: "Lorem Ipsum",
    role: "Head of Education",
    bio: "With a background in computer science education and curriculum development, Marcus oversees all educational programs at XPerience. He previously taught at leading universities and believes in the power of practical, hands-on learning.",
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
    bio: "Sophia brings extensive expertise in web development and digital strategy to lead our consulting division. Her client portfolio includes startups, nonprofits, and Fortune 500 companies seeking digital transformation.",
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
    bio: "David coordinates our nonprofit partnerships and community initiatives. His background in social work and tech education helps create meaningful programs that serve underrepresented communities.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&h=600&q=80",
    socialLinks: {
      linkedin: "https://linkedin.com",
      email: "david@xperience.com"
    }
  }
];

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Our Story
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
              XPerience was founded with a vision to transform how people and organizations engage with technology through education and expert consulting.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We're on a mission to empower individuals and organizations with the digital skills and resources they need to thrive in today's technology-driven world.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Through accessible education, expert consulting, and community initiatives, we're building a more inclusive digital future where everyone has the opportunity to participate and succeed.
              </p>
              
              <h3 className="text-2xl font-medium mb-4">Our Values</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <p className="font-medium">Accessibility</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <p className="font-medium">Excellence</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <p className="font-medium">Innovation</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <p className="font-medium">Community</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <p className="font-medium">Impact</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                  alt="Our Mission"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-lg overflow-hidden mt-8">
                <img
                  src="https://images.unsplash.com/photo-1486718448742-163732cd1544"
                  alt="Our Values"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our History */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Journey</h2>
            <p className="text-lg text-gray-600">
              Since our founding in 2018, we've been committed to making technology education accessible and helping businesses succeed in the digital economy.
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-px bg-gray-300"></div>
              
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:text-right md:pr-8 relative mb-8 md:mb-0">
                  <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                  <h3 className="text-xl font-medium mb-2">2018</h3>
                  <p className="text-gray-600">
                    XPerience was founded with a single coding bootcamp and a vision to make tech education more accessible.
                  </p>
                </div>
                <div className="md:pl-8"></div>
              </div>
            </div>
            
            <div className="relative pl-8 md:pl-0">
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:pr-8"></div>
                <div className="md:pl-8 relative">
                  <div className="hidden md:block absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                  <h3 className="text-xl font-medium mb-2">2019</h3>
                  <p className="text-gray-600">
                    Launched our consulting division to help small businesses and nonprofits establish effective online presences.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative pl-8 md:pl-0">
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:text-right md:pr-8 relative mb-8 md:mb-0">
                  <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                  <h3 className="text-xl font-medium mb-2">2020</h3>
                  <p className="text-gray-600">
                    Pivoted to virtual learning during the pandemic and expanded our reach to students nationwide.
                  </p>
                </div>
                <div className="md:pl-8"></div>
              </div>
            </div>
            
            <div className="relative pl-8 md:pl-0">
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:pr-8"></div>
                <div className="md:pl-8 relative">
                  <div className="hidden md:block absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                  <h3 className="text-xl font-medium mb-2">2022</h3>
                  <p className="text-gray-600">
                    Established our scholarship program to support students from underrepresented groups in tech.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative pl-8 md:pl-0">
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                <div className="md:text-right md:pr-8 relative mb-8 md:mb-0">
                  <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>
                  <h3 className="text-xl font-medium mb-2">2024</h3>
                  <p className="text-gray-600">
                    Celebrating our growth to over 4,500 graduates and 200+ business clients across the country.
                  </p>
                </div>
                <div className="md:pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
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
      
      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're looking to learn, teach, or partner with us, we'd love to hear from you.
          </p>
          <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black group">
            <Link to="/contact" className="flex items-center gap-2">
              Get in Touch
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
