import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: typeof LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'primary' | 'secondary' | 'accent';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color,
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 text-primary-600';
      case 'secondary':
        return 'bg-secondary-50 text-secondary-600';
      case 'accent':
        return 'bg-accent-50 text-accent-600';
      default:
        return 'bg-primary-50 text-primary-600';
    }
  };

  const getTrendClasses = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 transition-all hover:shadow-md animate-fade-in">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          <Icon size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
          {trend && trendValue && (
            <p className={`text-xs font-medium mt-1 ${getTrendClasses()}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;