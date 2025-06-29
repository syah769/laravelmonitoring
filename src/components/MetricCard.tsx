import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
  trend = 'neutral'
}) => {
  const changeColor = {
    positive: 'text-emerald-600 bg-emerald-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50'
  }[changeType];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg shadow-slate-900/10`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${changeColor}`}>
              {TrendIcon && <TrendIcon className="w-3.5 h-3.5" />}
              {change}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-slate-600 text-sm font-medium tracking-wide uppercase">{title}</h3>
          <p className="text-slate-900 text-3xl font-bold tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
};