
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, BookOpen } from 'lucide-react';
import ProgramEnrollment from './ProgramEnrollment';

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

const ProgramsGrid = () => {
  const { user } = useAuth();

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

  const { data: activeEnrollments = [] } = useQuery({
    queryKey: ['active-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('program_id')
        .eq('customer_id', user.id)
        .neq('status', 'cancelled'); // Only get non-cancelled enrollments
      
      if (error) throw error;
      return data.map(e => e.program_id);
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
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
    );
  }

  if (programs.length === 0) {
    return (
      <Card className="bg-white border-black">
        <CardContent className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-black mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">No Programs Available</h3>
          <p className="text-black">There are currently no programs available. Check back soon for new programs!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => {
        const isEnrolled = activeEnrollments.includes(program.id);
        
        return (
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
              
              <ProgramEnrollment
                programId={program.id}
                programTitle={program.title}
                isEnrolled={isEnrolled}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProgramsGrid;
