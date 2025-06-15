
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
  badge?: string;
}

const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  onClick, 
  badge 
}: QuickActionCardProps) => {
  return (
    <Card 
      className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md group"
      onClick={onClick}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {badge && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Action indicator */}
        <div className="mt-4 flex items-center text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
          <span>Click to access</span>
          <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
