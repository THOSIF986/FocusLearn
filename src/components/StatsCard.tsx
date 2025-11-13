import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
  iconColor?: string;
}

export function StatsCard({ icon, title, value, subtitle, iconColor = "text-indigo-600" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-slate-600 mb-2">{title}</h3>
      <div className="text-indigo-600 mb-1">{value}</div>
      <p className="text-slate-500 text-sm">{subtitle}</p>
    </div>
  );
}
