import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'VERIFIED':
      case 'APPROVED':
      case 'COMPLETED':
      case 'CLEARED':
      case 'ALLOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PENDING':
      case 'PENDING_REVERIFICATION':
      case 'FLAGGED':
      case 'MFA_REQUIRED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'REJECTED':
      case 'BLOCK':
      case 'FAILED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getLabel = () => {
    switch (normalized) {
      case 'PENDING_REVERIFICATION':
        return 'KYC Re-verification';
      default:
        return status;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {getLabel()}
    </span>
  );
}

