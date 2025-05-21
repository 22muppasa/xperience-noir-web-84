
import { Link } from 'react-router-dom';
import { animated, useSpring } from '@react-spring/web';
import { ArrowRight, Code, PenSquare } from 'lucide-react';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import AnimatedButton from '@/components/ui/AnimatedButton';

const Index = () => {
  // Animation for hero image
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 500 }
  });

  // Animation for cards
  const cardSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 700, delay: 300 }
  });

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="flex flex-col justify-center min-h-[85vh] px-4 md:px-6 py-16 pt-24 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-medium leading-tight tracking-tighter mb-6 animate-fade-in text-white">
                Transform Your Digital Experience
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl animate-fade-in animate-delay-100">
                We empower individuals and businesses through education and consulting to thrive in the digital world.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-200">
                <Link to="/programs">
                  <AnimatedButton 
                    className="flex items-center gap-2" 
                    sparkleColor="white" 
                    textColor="white"
                  >
                    Learn to Code
                  </AnimatedButton>
                </Link>
                <Link to="/consulting">
                  <AnimatedButton 
                    className="flex items-center gap-2"
                    sparkleColor="white" 
                    textColor="white"
                  >
                    Redesign My Site
                  </AnimatedButton>
                </Link>
              </div>
            </div>
            <animated.div style={fadeIn} className="relative h-96 lg:h-full">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="Digital Experience" 
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-xl"
              />
            </animated.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-4 md:px-6 bg-white/10 backdrop-blur-lg rounded-t-[2.5rem] relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-white">What We Offer</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our services are designed to help you succeed in today's digital landscape through education and expert consulting.
            </p>
          </div>
          
          <animated.div style={cardSpring} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover-scale shadow-sm text-white">
              <div className="w-14 h-14 bg-white/20 text-white flex items-center justify-center rounded-2xl mb-6">
                <Code size={24} />
              </div>
              <h3 className="text-2xl font-medium mb-4">Coding Education</h3>
              <p className="text-gray-300 mb-6">
                From beginner workshops to advanced bootcamps, we teach the skills needed for the digital economy.
              </p>
              <Link to="/programs" className="inline-flex items-center font-medium button-hover text-white">
                Explore Programs
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover-scale shadow-sm text-white">
              <div className="w-14 h-14 bg-white/20 text-white flex items-center justify-center rounded-2xl mb-6">
                <PenSquare size={24} />
              </div>
              <h3 className="text-2xl font-medium mb-4">Web Consulting</h3>
              <p className="text-gray-300 mb-6">
                Our expert team helps businesses transform their online presence with modern, effective websites.
              </p>
              <Link to="/consulting" className="inline-flex items-center font-medium button-hover text-white">
                Our Process
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover-scale shadow-sm text-white">
              <div className="w-14 h-14 bg-white/20 text-white flex items-center justify-center rounded-2xl mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-4">Community Impact</h3>
              <p className="text-gray-300 mb-6">
                We're committed to making digital skills accessible to underrepresented communities.
              </p>
              <Link to="/impact" className="inline-flex items-center font-medium button-hover text-white">
                See Our Impact
              </Link>
            </div>
          </animated.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4 md:px-6 bg-black/50 backdrop-blur-lg text-white rounded-b-none relative z-10">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-medium mb-8">Ready to transform your digital experience?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Whether you want to learn coding or need expert consulting for your website, we're here to help you succeed.
          </p>
          <div className="flex justify-center">
            <Link to="/contact">
              <AnimatedButton 
                sparkleColor="white" 
                textColor="white"
              >
                Get in Touch
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
