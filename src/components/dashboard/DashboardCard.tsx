import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Remove colored gradients, use default neutral styling (white background, gray border)
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
}: DashboardCardProps) => {
  return (
    <Card className={`relative overflow-hidden border border-gray-200 bg-white rounded-xl shadow-none group hover:shadow hover:scale-105 transition-all duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-base font-semibold text-black">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {trend && (
            <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${trend.isPositive
              ? 'text-black bg-gray-100'
              : 'text-black bg-gray-100'
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
            <div className={`p-2 rounded-lg bg-gray-100`}>
              <div className="text-black">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-3">
          <div className="text-3xl font-bold text-black tracking-tight">{value}</div>
          {description && (
            <p className="text-sm text-black leading-relaxed">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
