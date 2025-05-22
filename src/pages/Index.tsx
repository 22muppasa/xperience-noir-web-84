
import { Link } from 'react-router-dom';
import { animated, useSpring } from '@react-spring/web';
import { ArrowRight, Code, PenSquare, User } from 'lucide-react';
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
              <h1 className="text-5xl md:text-7xl font-medium leading-tight tracking-tighter mb-6 animate-fade-in text-black">
                Transform Your Digital Experience
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-xl animate-fade-in animate-delay-100">
                We empower individuals and businesses through education and consulting to thrive in the digital world.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-200">
                <Link to="/programs">
                  <AnimatedButton 
                    className="flex items-center gap-2" 
                    sparkleColor="white" 
                    textColor="white"
                    icon={Code}
                  >
                    Learn to Code
                  </AnimatedButton>
                </Link>
                <Link to="/consulting">
                  <AnimatedButton 
                    className="flex items-center gap-2"
                    sparkleColor="black" 
                    textColor="black"
                    icon={PenSquare}
                    invertOnHover={true}
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
            {/* Feature Card 1 */}
            <Link to="/programs" className="card-wrapper">
              <div className="feature-card card-programs">
                <div className="icon-container">
                  <Code size={24} />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-white card-text">Coding Education</h3>
                <p className="text-gray-300 mb-6 card-text">
                  From beginner workshops to advanced bootcamps, we teach the skills needed for the digital economy.
                </p>
              </div>
            </Link>
            
            {/* Feature Card 2 */}
            <Link to="/consulting" className="card-wrapper">
              <div className="feature-card card-consulting">
                <div className="icon-container">
                  <PenSquare size={24} />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-white card-text">Web Consulting</h3>
                <p className="text-gray-300 mb-6 card-text">
                  Our expert team helps businesses transform their online presence with modern, effective websites.
                </p>
              </div>
            </Link>
            
            {/* Feature Card 3 - About Us (replacing Community Impact) */}
            <Link to="/about" className="card-wrapper">
              <div className="feature-card card-about">
                <div className="icon-container">
                  <User size={24} />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-white card-text">About Us</h3>
                <p className="text-gray-300 mb-6 card-text">
                  Learn about our company, our mission and the team behind our transformative services.
                </p>
              </div>
            </Link>
          </animated.div>
        </div>

        {/* Add the custom CSS here for the feature cards */}
        <style>
{`
.card-wrapper {
  perspective: 1000px;
  display: block;
  text-decoration: none;
}

.feature-card {
  position: relative;
  width: 100%;
  min-height: 320px;
  background: #000000;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 2rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.feature-card::before,
.feature-card::after {
  position: absolute;
  content: "";
  width: 20%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: bold;
  background-color: white;
  transition: all 0.5s;
  z-index: 0;
  color: black;
}

.feature-card::before {
  top: 0;
  right: 0;
  border-radius: 0 15px 0 100%;
}

.feature-card::after {
  bottom: 0;
  left: 0;
  border-radius: 0 100% 0 15px;
}

.feature-card:hover::before,
.feature-card:hover::after {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  transition: all 0.5s;
}

.feature-card:hover .card-text {
  opacity: 0;
  transition: opacity 0.3s;
}

.card-programs:hover::after {
  content: "LEARN PROGRAMMING SKILLS";
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: clamp(1rem, 4vw, 1.5rem);
  line-height: 1.4;
}

.card-consulting:hover::after {
  content: "TRANSFORM YOUR WEBSITE";
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: clamp(1rem, 4vw, 1.5rem);
  line-height: 1.4;
}

.card-about:hover::after {
  content: "MEET OUR TEAM";
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: clamp(1rem, 4vw, 1.5rem);
  line-height: 1.4;
}

.icon-container {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
}

.feature-card h3,
.feature-card p,
.feature-card a,
.feature-card .icon-container {
  position: relative;
  z-index: 2;
}
`}
        </style>
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
                icon={ArrowRight}
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
