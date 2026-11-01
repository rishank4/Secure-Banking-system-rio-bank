import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon
}: StatsCardProps) {
  const changeStyles = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    negative: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    neutral: 'text-slate-400 bg-slate-800/50 border-slate-700/50'
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm shadow-sm hover:border-slate-700/80 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-1.5">{value}</h3>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-slate-800/80 text-indigo-400 border border-slate-700/50">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-slate-800/60">
          {change && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${changeStyles[changeType]}`}>
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-400 font-normal">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

