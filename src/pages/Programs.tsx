import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, BookOpen, ArrowRight, Mail, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useAdminSettings } from '@/hooks/useAdminSettings';

interface Program {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  start_date: string;
  end_date: string;
  max_participants: number;
  image_url?: string;
  status: string;
}

const Programs = () => {
  const { getExternalProgramsSettings } = useAdminSettings();
  const externalPrograms = getExternalProgramsSettings();

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['public-programs'],
    queryFn: async () => {
      console.log('Fetching published programs...');
      
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching programs:', error);
        throw error;
      }
      
      console.log('Fetched programs:', data);
      return data as Program[];
    }
  });

  // Show external link when enabled, has a link, and no internal programs exist
  const shouldShowExternalLink = externalPrograms?.enabled && 
                                externalPrograms?.link && 
                                externalPrograms.link.trim() !== '' &&
                                programs.length === 0;

  console.log('External programs config:', externalPrograms);
  console.log('Should show external link:', shouldShowExternalLink);
  console.log('Programs count:', programs.length);

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
            {shouldShowExternalLink ? (
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black animate-fade-in animate-delay-200">
                <a href={externalPrograms.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  See Our Programs
                </a>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black animate-fade-in animate-delay-200">
                <Link to="/contact">Learn More About Our Programs</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-black">Our Programs</h2>
            {shouldShowExternalLink ? (
              <Button variant="outline" asChild>
                <a href={externalPrograms.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  See Our Programs
                </a>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  Get Program Information
                  <ArrowRight size={16} />
                </Link>
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse bg-white border border-gray-200 rounded-xl shadow-soft">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : programs.length === 0 ? (
            <Card className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-soft">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                {shouldShowExternalLink ? (
                  <>
                    <h3 className="text-lg font-semibold mb-2 text-black">Programs Available Elsewhere</h3>
                    <p className="text-gray-600 mb-6">
                      {externalPrograms.description || "We have exciting programs available! Click below to explore them."}
                    </p>
                    <Button asChild className="bg-black text-white hover:bg-gray-800 transition-colors">
                      <a href={externalPrograms.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        See Our Programs
                      </a>
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2 text-black">No Programs Available</h3>
                    <p className="text-gray-600 mb-6">
                      We're currently preparing new programs. Check back soon for exciting opportunities!
                    </p>
                    <Button variant="outline" asChild className="text-black border-black hover:bg-black hover:text-white">
                      <Link to="/contact">Get Notified</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <Card key={program.id} className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 group">
                  {program.image_url ? (
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white text-black border border-black">
                          {program.status}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-black to-gray-800 flex items-center justify-center relative overflow-hidden">
                      <BookOpen className="h-16 w-16 text-white transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white text-black border border-black">
                          {program.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="line-clamp-2 text-black text-xl font-medium">{program.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pt-0">
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {program.price && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-black font-medium">${program.price}</span>
                        </div>
                      )}
                      
                      {program.duration && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{program.duration}</span>
                        </div>
                      )}
                      
                      {program.start_date && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{new Date(program.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {program.max_participants && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Max {program.max_participants}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <Button asChild className="w-full bg-black text-white hover:bg-gray-800 transition-colors">
                        <Link to="/contact">
                          <Mail className="h-4 w-4 mr-2" />
                          Inquire About Program
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
          {shouldShowExternalLink ? (
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black">
              <a href={externalPrograms.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                See Our Programs
              </a>
            </Button>
          ) : (
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black">
              <Link to="/contact">Contact Us Today</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Programs;
