
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { ArrowRight, Users, Trophy, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";

const Index = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center z-10">
          <h1 className={`text-6xl md:text-8xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Experience
            <span className="block">Noir</span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Empowering the next generation through innovative technology education and creative exploration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/programs">
              <AnimatedButton className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg">
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </Link>
            
            <Link to="/auth">
              <AnimatedButton className="px-8 py-4 text-lg border border-black bg-transparent hover:bg-black hover:text-white" 
                sparkleColor={isDarkMode ? "white" : "black"} 
                textColor={isDarkMode ? "white" : "black"}>
                Access Dashboard
                <Users className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Why Choose Experience Noir?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center p-8 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <Trophy className={`h-16 w-16 mx-auto mb-6 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              <h3 className={`text-2xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                Expert Instruction
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Learn from industry professionals with years of experience in technology and creative fields.
              </p>
            </div>
            
            <div className={`text-center p-8 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <Users className={`h-16 w-16 mx-auto mb-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <h3 className={`text-2xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                Small Class Sizes
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Personalized attention with limited enrollment to ensure every student gets the support they need.
              </p>
            </div>
            
            <div className={`text-center p-8 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <Star className={`h-16 w-16 mx-auto mb-6 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-500'
              }`} />
              <h3 className={`text-2xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                Portfolio Development
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Build a comprehensive portfolio showcasing your child's growth and achievements throughout their journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            Ready to Start the Journey?
          </h2>
          
          <p className={`text-xl mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join our community of learners and unlock your child's potential in technology and creativity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <AnimatedButton className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </Link>
            
            <Link to="/contact">
              <AnimatedButton className="px-8 py-4 text-lg border border-black bg-transparent hover:bg-black hover:text-white"
                sparkleColor={isDarkMode ? "white" : "black"} 
                textColor={isDarkMode ? "white" : "black"}>
                Contact Us
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
