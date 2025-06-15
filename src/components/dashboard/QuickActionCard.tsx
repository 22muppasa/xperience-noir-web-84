
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string; // Make gradient optional since we're removing gradients
  onClick: () => void;
  badge?: string;
  children?: React.ReactNode;
}

const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  badge,
  children
}: QuickActionCardProps) => {
  return (
    <Card
      className="relative overflow-hidden border border-gray-200 bg-white rounded-xl shadow-none group hover:shadow hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={children ? undefined : onClick}
    >
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gray-100">
            <Icon className="h-6 w-6 text-gray-800" />
          </div>
          {badge && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {description}
          </p>
        </div>
        {children ? (
          <div className="mt-4">
            {children}
          </div>
        ) : (
          <div className="mt-4 flex items-center text-xs font-medium text-gray-400">
            <span>Click to access</span>
            <span className="ml-1">→</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
