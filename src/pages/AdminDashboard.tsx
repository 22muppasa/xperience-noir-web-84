
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, MessageSquare, FileText, Image, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Customers"
            value="24"
            description="+2 from last month"
            icon={Users}
            trend={{ value: "+8.3% from last month", positive: true }}
          />
          <DashboardCard
            title="Active Programs"
            value="8"
            description="5 starting this month"
            icon={BookOpen}
          />
          <DashboardCard
            title="Total Enrollments"
            value="45"
            description="+12 this week"
            icon={FileText}
            trend={{ value: "+15.2% from last week", positive: true }}
          />
          <DashboardCard
            title="Unread Messages"
            value="7"
            description="3 urgent"
            icon={MessageSquare}
          />
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Customer Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                View All Customers
              </Button>
              <Button className="w-full" variant="outline">
                Customer Enrollments
              </Button>
              <Button className="w-full" variant="outline">
                Customer Messages
              </Button>
            </CardContent>
          </Card>

          {/* Program Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Program Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Create New Program
              </Button>
              <Button className="w-full" variant="outline">
                Manage Programs
              </Button>
              <Button className="w-full" variant="outline">
                View Enrollments
              </Button>
            </CardContent>
          </Card>

          {/* Kids Work Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="mr-2 h-5 w-5" />
                Kids Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Upload Work
              </Button>
              <Button className="w-full" variant="outline">
                Manage Gallery
              </Button>
              <Button className="w-full" variant="outline">
                View Comments
              </Button>
            </CardContent>
          </Card>

          {/* Communication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Send Message
              </Button>
              <Button className="w-full" variant="outline">
                Group Message
              </Button>
              <Button className="w-full" variant="outline">
                Message Templates
              </Button>
            </CardContent>
          </Card>

          {/* Contact Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Contact Forms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                View Submissions
              </Button>
              <Button className="w-full" variant="outline">
                Pending Responses
              </Button>
              <Button className="w-full" variant="outline">
                Archive
              </Button>
            </CardContent>
          </Card>

          {/* Social Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Social Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Create Post
              </Button>
              <Button className="w-full" variant="outline">
                Manage Posts
              </Button>
              <Button className="w-full" variant="outline">
                Schedule Posts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New customer registration: Sarah Johnson</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Program enrollment: Summer Art Camp</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New contact form submission</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Respond</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
