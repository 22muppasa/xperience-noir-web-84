
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import ProgramsGrid from '@/components/programs/ProgramsGrid';
import EditEnrollmentDialog from '@/components/customer/EditEnrollmentDialog';

interface Enrollment {
  id: string;
  program_id: string;
  child_name: string;
  enrolled_at: string;
  status: string;
  programs: {
    title: string;
  };
  notes?: string;
}

const Programs = () => {
  const { user } = useAuth();

  // Fetch user's enrollments from the database
  const { data: myEnrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['my-enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          program_id,
          child_name,
          enrolled_at,
          status,
          programs!inner(title),
          notes
        `)
        .eq('customer_id', user.id)
        .order('enrolled_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching enrollments:', error);
        throw error;
      }
      
      return data as Enrollment[];
    },
    enabled: !!user?.id
  });

  // Filter out cancelled enrollments for display
  const activeEnrollments = myEnrollments.filter(enrollment => enrollment.status !== 'cancelled');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Programs</h1>
          <p className="text-black">Browse and enroll in camp programs</p>
        </div>

        {/* My Enrollments */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">My Enrollments</h2>
          {enrollmentsLoading ? (
            <Card className="bg-white border-black">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ) : activeEnrollments.length > 0 ? (
            <div className="grid gap-4">
              {activeEnrollments.map((enrollment) => (
                <Card key={enrollment.id} className="bg-white border-black">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-black">{enrollment.programs.title}</h3>
                        <p className="text-sm text-black">Child: {enrollment.child_name}</p>
                        <p className="text-sm text-black">
                          Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </p>
                        {enrollment.notes && (
                          <p className="text-sm text-gray-600 mt-1">Notes: {enrollment.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={`${
                            enrollment.status === 'active' 
                              ? 'bg-green-50 text-green-700 border-green-700'
                              : enrollment.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-700'
                              : 'bg-gray-50 text-gray-700 border-gray-700'
                          }`}
                        >
                          {enrollment.status}
                        </Badge>
                        <EditEnrollmentDialog enrollment={enrollment} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white border-black">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-black mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-black">No enrollments yet</h3>
                <p className="text-black">Enroll in a program below to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Available Programs */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">Available Programs</h2>
          <ProgramsGrid />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Programs;
