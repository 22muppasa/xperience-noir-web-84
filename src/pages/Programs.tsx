
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, DollarSign, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      console.log('Fetching programs from database...');
      
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

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Programs</h1>
            <p className="text-xl text-gray-600">Discover our educational programs and workshops</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse bg-white border-black">
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Programs</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover our educational programs designed to enhance your digital skills and knowledge
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">Interested in Our Programs?</h3>
            <p className="text-blue-800 mb-4">
              Contact us to learn more about program availability, schedules, and enrollment details.
            </p>
            <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
              <Link to="/contact">Get Program Information</Link>
            </Button>
          </div>
        </div>

        {programs.length === 0 ? (
          <Card className="bg-white border-black">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-black mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">No Programs Available</h3>
              <p className="text-black mb-6">
                We're currently developing new programs. Check back soon for exciting educational opportunities!
              </p>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Us for Updates</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border-black">
                {program.image_url && (
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
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
                )}
                
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-black">{program.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-black line-clamp-3">{program.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {program.price && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-black" />
                        <span className="text-black">${program.price}</span>
                      </div>
                    )}
                    
                    {program.duration && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-black" />
                        <span className="text-black">{program.duration}</span>
                      </div>
                    )}
                    
                    {program.start_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-black" />
                        <span className="text-black">{new Date(program.start_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {program.max_participants && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-black" />
                        <span className="text-black">Max {program.max_participants}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button asChild className="w-full bg-white text-black border border-black hover:bg-gray-100">
                    <Link to="/contact">Learn More & Inquire</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Programs;
