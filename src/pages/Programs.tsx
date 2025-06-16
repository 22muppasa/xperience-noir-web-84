
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, BookOpen, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import ProgramEnrollment from '@/components/programs/ProgramEnrollment';

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
  const { user } = useAuth();

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['public-programs'],
    queryFn: async () => {
      console.log('Fetching published programs...');
      
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('status', 'published')
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching programs:', error);
        throw error;
      }
      
      console.log('Fetched programs:', data);
      return data as Program[];
    }
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['user-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('program_id')
        .eq('customer_id', user.id);
      
      if (error) throw error;
      return data.map(e => e.program_id);
    },
    enabled: !!user?.id
  });

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
            {user ? (
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                <Link to="/customer/programs">View My Enrollments</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                <Link to="/auth">Sign In to Enroll</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      
      {/* Programs Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-medium">Available Programs</h2>
            {user && (
              <Button variant="outline" asChild>
                <Link to="/customer/programs" className="flex items-center gap-2">
                  Manage Enrollments
                  <ArrowRight size={16} />
                </Link>
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
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
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Programs Available</h3>
                <p className="text-gray-600 mb-4">
                  We're currently preparing new programs. Check back soon for exciting opportunities!
                </p>
                <Button variant="outline" asChild>
                  <Link to="/contact">Get Notified</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => {
                const isEnrolled = enrollments.includes(program.id);
                
                return (
                  <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {program.image_url ? (
                      <div className="h-48 relative">
                        <img
                          src={program.image_url}
                          alt={program.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white text-black border border-black">
                            {program.status}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white" />
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{program.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 line-clamp-3">{program.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {program.price && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span>${program.price}</span>
                          </div>
                        )}
                        
                        {program.duration && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{program.duration}</span>
                          </div>
                        )}
                        
                        {program.start_date && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{new Date(program.start_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {program.max_participants && (
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>Max {program.max_participants}</span>
                          </div>
                        )}
                      </div>
                      
                      {user ? (
                        <ProgramEnrollment
                          programId={program.id}
                          programTitle={program.title}
                          isEnrolled={isEnrolled}
                        />
                      ) : (
                        <Button asChild className="w-full">
                          <Link to="/auth">Sign In to Enroll</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-medium text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">How do I enroll my child in a program?</h3>
              <p className="text-gray-600">
                First, create an account and link your children to your profile. Then browse available programs and click "Enroll Now" to select which children you'd like to enroll.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">Can I enroll multiple children in the same program?</h3>
              <p className="text-gray-600">
                Yes! Our enrollment system allows you to select multiple children for the same program, making it easy for families with multiple kids.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">What happens after I submit an enrollment?</h3>
              <p className="text-gray-600">
                Your enrollment will be reviewed by our team. You'll receive a confirmation email and can track the status in your customer dashboard.
              </p>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">Are there any prerequisites for the programs?</h3>
              <p className="text-gray-600">
                Each program has its own requirements which are listed in the program description. Most programs are designed to be accessible to children of various skill levels.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-black text-white text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community and give your children access to high-quality educational programs designed to foster growth and creativity.
          </p>
          {user ? (
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black">
              <Link to="/customer/programs">View My Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-black">
              <Link to="/auth">Create Account</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Programs;
