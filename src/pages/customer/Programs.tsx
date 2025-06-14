
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Users, Clock } from 'lucide-react';

const Programs = () => {
  // Mock data for programs
  const availablePrograms = [
    {
      id: 1,
      title: 'Summer Art Camp',
      description: 'Creative arts program for kids aged 6-12',
      duration: '2 weeks',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      price: 299,
      maxParticipants: 20,
      enrolled: 15,
      category: 'Arts',
      status: 'open'
    },
    {
      id: 2,
      title: 'STEM Workshop',
      description: 'Science, Technology, Engineering, and Math activities',
      duration: '1 week',
      startDate: '2024-07-08',
      endDate: '2024-07-12',
      price: 199,
      maxParticipants: 15,
      enrolled: 12,
      category: 'STEM',
      status: 'open'
    },
    {
      id: 3,
      title: 'Nature Adventure',
      description: 'Outdoor exploration and environmental education',
      duration: '3 days',
      startDate: '2024-07-15',
      endDate: '2024-07-17',
      price: 149,
      maxParticipants: 25,
      enrolled: 25,
      category: 'Outdoor',
      status: 'full'
    }
  ];

  const myEnrollments = [
    {
      id: 1,
      programTitle: 'Summer Art Camp',
      childName: 'Emma Johnson',
      enrolledDate: '2024-06-15',
      status: 'confirmed'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600">Browse and enroll in camp programs</p>
        </div>

        {/* My Enrollments */}
        <div>
          <h2 className="text-lg font-semibold mb-4">My Enrollments</h2>
          <div className="grid gap-4">
            {myEnrollments.map((enrollment) => (
              <Card key={enrollment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{enrollment.programTitle}</h3>
                      <p className="text-sm text-gray-600">Child: {enrollment.childName}</p>
                      <p className="text-sm text-gray-500">Enrolled: {enrollment.enrolledDate}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {enrollment.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Programs */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <Badge variant={program.status === 'open' ? 'default' : 'destructive'}>
                      {program.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{program.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {program.startDate} - {program.endDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {program.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {program.enrolled}/{program.maxParticipants} enrolled
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-lg font-bold text-gray-900">${program.price}</span>
                    <Button 
                      disabled={program.status === 'full'}
                      className="w-24"
                    >
                      {program.status === 'full' ? 'Full' : 'Enroll'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Programs;
