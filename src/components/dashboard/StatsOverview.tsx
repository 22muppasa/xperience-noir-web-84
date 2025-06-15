
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Image, MessageSquare, User, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  gradient: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, description, icon, gradient, trend }: StatCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md">
      <div className={`absolute inset-0 ${gradient} opacity-5`}></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${gradient} bg-opacity-10`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          {trend && (
            <div className={`flex items-center text-xs font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        
        {/* Progress bar for visual appeal */}
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${gradient} transition-all duration-500`} style={{ width: '75%' }}></div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsOverview = () => {
  const stats = [
    {
      title: "Active Programs",
      value: "3",
      description: "Currently enrolled",
      icon: <BookOpen className="h-5 w-5" />,
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Kids Work",
      value: "12",
      description: "New uploads this week",
      icon: <Image className="h-5 w-5" />,
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Messages",
      value: "2",
      description: "Unread messages",
      icon: <MessageSquare className="h-5 w-5" />,
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
      trend: { value: 3, isPositive: false }
    },
    {
      title: "Profile",
      value: "85%",
      description: "Profile complete",
      icon: <User className="h-5 w-5" />,
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600",
      trend: { value: 5, isPositive: true }
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className="animate-fade-in"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'forwards'
          }}
        >
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
