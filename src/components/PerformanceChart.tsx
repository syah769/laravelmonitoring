import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { SystemMetrics } from '../types/monitoring';
import { Activity, TrendingUp } from 'lucide-react';

interface PerformanceChartProps {
  data: SystemMetrics[];
  title: string;
  dataKey: keyof SystemMetrics;
  color: string;
  unit?: string;
  gradient?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  title,
  dataKey,
  color,
  unit = '',
  gradient = 'from-blue-500/20 to-blue-500/5'
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentValue = data[data.length - 1]?.[dataKey] || 0;
  const previousValue = data[data.length - 2]?.[dataKey] || 0;
  const percentChange = previousValue ? ((Number(currentValue) - Number(previousValue)) / Number(previousValue) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100">
            <Activity className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{currentValue}{unit}</span>
              {percentChange !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  percentChange > 0 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${percentChange < 0 ? 'rotate-180' : ''}`} />
                  {Math.abs(percentChange).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-64 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeWidth={1} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime}
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                color: '#0F172A',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                fontSize: '14px',
                fontWeight: '500'
              }}
              formatter={(value: any) => [`${value}${unit}`, title]}
              labelFormatter={(label) => formatTime(label)}
              cursor={{ stroke: color, strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              fill={`url(#gradient-${dataKey})`}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: color, 
                stroke: '#FFFFFF', 
                strokeWidth: 2,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};