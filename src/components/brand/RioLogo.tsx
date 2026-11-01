import React from 'react';

interface RioLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  onClick?: () => void;
}

export default function RioLogo({ className = '', size = 'md', showSubtitle = true, onClick }: RioLogoProps) {
  const iconSizes = {
    sm: 'h-7 w-7 text-sm',
    md: 'h-9 w-9 text-base',
    lg: 'h-11 w-11 text-xl'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 group cursor-pointer select-none focus:outline-none ${className}`}
    >
      {/* Minimalist Geometric Logo Icon */}
      <div className={`${iconSizes[size]} rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-900 border border-indigo-400/30 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-950/50 transition-transform group-hover:scale-105`}>
        <span className="tracking-tighter font-mono">₹</span>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span className={`${textSizes[size]} font-bold tracking-tight text-white`}>RIO</span>
          <span className={`${textSizes[size]} font-light tracking-wide text-indigo-400`}>BANKING</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium block">
            Reserve Premier • IFSC: RIOB0001042
          </span>
        )}
      </div>
    </div>
  );
}
