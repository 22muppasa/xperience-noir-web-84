
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  gradient?: string;
}

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend,
  className = "",
  gradient = "bg-gradient-to-r from-blue-500 to-blue-600"
}: DashboardCardProps) => {
  return (
    <Card className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg ${className}`}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 ${gradient} opacity-5`}></div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {trend && (
            <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
              trend.isPositive 
                ? 'text-green-700 bg-green-100' 
                : 'text-red-700 bg-red-100'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
          {icon && (
            <div className={`p-2 rounded-lg ${gradient} bg-opacity-10`}>
              <div className="text-gray-700">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-3">
          <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          )}
          
          {/* Visual progress indicator */}
          <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${gradient} transition-all duration-700 ease-out`} 
              style={{ width: '70%' }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
