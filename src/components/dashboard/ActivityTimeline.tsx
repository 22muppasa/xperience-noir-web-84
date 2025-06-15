
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageSquare, Upload, Award } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'upload' | 'message' | 'enrollment' | 'achievement';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

const ActivityTimeline = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'upload',
      title: 'New work uploaded',
      description: 'Summer Camp artwork completed',
      time: '2 hours ago',
      icon: <Upload className="h-4 w-4" />,
      color: 'bg-green-500'
    },
    {
      id: '2',
      type: 'message',
      title: 'Message from instructor',
      description: 'Great progress on your latest project!',
      time: '1 day ago',
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'bg-blue-500'
    },
    {
      id: '3',
      type: 'enrollment',
      title: 'Enrolled in new program',
      description: 'Art Workshop - Advanced Techniques',
      time: '3 days ago',
      icon: <BookOpen className="h-4 w-4" />,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Achievement unlocked',
      description: 'Completed 5 creative projects',
      time: '1 week ago',
      icon: <Award className="h-4 w-4" />,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <Card className="shadow-md border-0 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
          Recent Activity
          <span className="ml-2 text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {activities.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="relative flex items-start space-x-4 pb-6 animate-fade-in"
              style={{ 
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'forwards'
              }}
            >
              {/* Timeline dot */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${activity.color} text-white shadow-lg`}>
                {activity.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
            View All Activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
