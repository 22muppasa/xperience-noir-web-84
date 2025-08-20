
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, BookOpen, ArrowRight, Mail } from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import Navbar from '@/components/layout/Navbar';

const Programs = () => {
  const { isLoading, isExternalProgramsEnabled, getExternalProgramsLink } = useAdminSettings();

  const handleExternalLinkClick = () => {
    window.open(getExternalProgramsLink(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-medium mb-6 animate-fade-in">
              Educational Programs
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in animate-delay-100">
              Discover our comprehensive programs designed to nurture growth, creativity, and learning in children of all ages.
            </p>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black animate-fade-in animate-delay-200">
              <Link to="/contact">Learn More About Our Programs</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black">Our Programs</h2>
            <Button variant="outline" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                Get Program Information
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <span className="ml-3 text-black">Loading programs...</span>
            </div>
          ) : isExternalProgramsEnabled() && getExternalProgramsLink() ? (
            /* External Program Link Active */
            <Card className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-soft">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-black mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-black">Ready to Explore Our Programs?</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  We've partnered with a specialized platform to bring you the best educational programs. 
                  Click below to browse our current offerings, schedules, and enrollment options.
                </p>
                <Button 
                  size="lg" 
                  onClick={handleExternalLinkClick}
                  className="bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  See Our Programs
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Opens in a new window
                </p>
              </CardContent>
            </Card>
          ) : (
            /* No Programs Available */
            <Card className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-soft">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black">No Programs Available</h3>
                <p className="text-gray-600 mb-6">
                  We're currently preparing new programs. Check back soon for exciting opportunities!
                </p>
                <Button variant="outline" asChild className="text-black border-black hover:bg-black hover:text-white">
                  <Link to="/contact">Get Notified</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-medium text-center mb-12 text-black">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-soft">
              <h3 className="text-xl font-medium mb-2 text-black">What programs do you offer?</h3>
              <p className="text-gray-600">
                We offer a variety of educational programs designed for different age groups and interests. Each program focuses on specific skills and learning objectives to help children grow and develop.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-soft">
              <h3 className="text-xl font-medium mb-2 text-black">How can I learn more about a specific program?</h3>
              <p className="text-gray-600">
                You can contact us directly through our contact form or give us a call. Our team will provide detailed information about any program you're interested in and answer all your questions.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-soft">
              <h3 className="text-xl font-medium mb-2 text-black">What age groups do your programs serve?</h3>
              <p className="text-gray-600">
                Our programs are designed for various age groups, from young children to teenagers. Each program listing includes the recommended age range and any specific requirements.
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-soft">
              <h3 className="text-xl font-medium mb-2 text-black">Do you offer scholarships or financial assistance?</h3>
              <p className="text-gray-600">
                We believe in making our programs accessible to all families. Please contact us to discuss available financial assistance options and scholarship opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Ready to Learn More?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact us today to discover how our educational programs can benefit your child's growth and development.
          </p>
          <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black">
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Programs;
