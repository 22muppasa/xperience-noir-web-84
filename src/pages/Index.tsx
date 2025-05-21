import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { animated, useSpring } from '@react-spring/web';
import { ArrowRight, Code, PenSquare } from 'lucide-react';

const Index = () => {
  // Replace motion with animated from react-spring
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 500 }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col justify-center min-h-[80vh] px-4 md:px-6 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-medium leading-tight tracking-tighter mb-6 animate-fade-in">
                Transform Your Digital Experience
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-xl animate-fade-in animate-delay-100">
                We empower individuals and businesses through education and consulting to thrive in the digital world.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-200">
                <Button size="lg" asChild className="group">
                  <Link to="/programs" className="flex items-center gap-2">
                    <Code size={18} />
                    Learn to Code
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="group">
                  <Link to="/consulting" className="flex items-center gap-2">
                    <PenSquare size={18} />
                    Redesign My Site
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
            <animated.div style={fadeIn} className="relative h-96 lg:h-full">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="Digital Experience" 
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </animated.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium mb-6">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our services are designed to help you succeed in today's digital landscape through education and expert consulting.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg border hover-scale">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full mb-6">
                <Code size={24} />
              </div>
              <h3 className="text-2xl font-medium mb-4">Coding Education</h3>
              <p className="text-gray-600 mb-6">
                From beginner workshops to advanced bootcamps, we teach the skills needed for the digital economy.
              </p>
              <Link to="/programs" className="inline-flex items-center font-medium button-hover">
                Explore Programs
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg border hover-scale">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full mb-6">
                <PenSquare size={24} />
              </div>
              <h3 className="text-2xl font-medium mb-4">Web Consulting</h3>
              <p className="text-gray-600 mb-6">
                Our expert team helps businesses transform their online presence with modern, effective websites.
              </p>
              <Link to="/consulting" className="inline-flex items-center font-medium button-hover">
                Our Process
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg border hover-scale">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-4">Community Impact</h3>
              <p className="text-gray-600 mb-6">
                We're committed to making digital skills accessible to underrepresented communities.
              </p>
              <Link to="/impact" className="inline-flex items-center font-medium button-hover">
                See Our Impact
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-medium mb-6">Ready to transform your digital experience?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Whether you want to learn coding or need expert consulting for your website, we're here to help you succeed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black group">
              <Link to="/contact" className="flex items-center gap-2">
                Get in Touch
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
