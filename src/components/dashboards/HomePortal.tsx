import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ShieldCheck, Briefcase, Users, User, ArrowRight } from 'lucide-react';

interface HomePortalProps {
  onSelectRole: (role: UserRole) => void;
}

export default function HomePortal({ onSelectRole }: HomePortalProps) {
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleQuickLogin = (role: UserRole) => {
    setLoadingRole(role);
    setTimeout(() => {
      onSelectRole(role);
      setLoadingRole(null);
    }, 200);
  };

  const personas = [
    {
      role: 'manager' as UserRole,
      title: 'Branch Manager',
      name: 'Rajesh Sharma',
      badge: 'Executive Governance',
      description: 'Supervise Nariman Point branch assets (₹842.50 Cr AUM), audit transaction velocity, and approve high-value RTGS releases.',
      metrics: '₹842.50 Cr AUM • 4 Pending Actions',
      icon: <Briefcase className="w-6 h-6 text-amber-400" />,
      border: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
      btnColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold'
    },
    {
      role: 'employee' as UserRole,
      title: 'Banking Officer',
      name: 'Priya Nair',
      badge: 'Operations & Desk',
      description: 'Perform customer 360 lookup across Maharashtra & Karnataka, verify RBI KYC compliance, and simulate counter deposits.',
      metrics: '4 Accounts Loaded • Real-time Search',
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      border: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold'
    },
    {
      role: 'customer' as UserRole,
      title: 'Premier Wealth Client',
      name: 'Aarav Patel',
      badge: 'Retail NetBanking',
      description: 'Check active savings & fixed deposit portfolios, execute IMPS/NEFT transfers with AI risk evaluation, and review digital passbook.',
      metrics: '₹8,45,250.00 Balance • Instant Transfer',
      icon: <User className="w-6 h-6 text-indigo-400" />,
      border: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
      btnColor: 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center animate-in fade-in duration-300">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Rio Banking Architecture • Presentation Mode Active</span>
      </div>

      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Reserve Banking, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">Reimagined.</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Demonstrate end-to-end Role-Based Access Control, authentic Indian demographic mock telemetry, and autonomous Python risk scoring. Select a role below to explore.
        </p>
      </div>

      {/* 3 Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {personas.map((p) => (
          <div
            key={p.role}
            className={`bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md transition-all duration-200 flex flex-col justify-between shadow-xl ${p.border}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  {p.icon}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  {p.badge}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">{p.title}</h2>
              <p className="text-xs font-semibold text-slate-300 mt-0.5">{p.name}</p>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                {p.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                {p.metrics}
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin(p.role)}
              disabled={loadingRole !== null}
              className={`mt-6 w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all shadow-md ${p.btnColor} ${loadingRole === p.role ? 'opacity-70 cursor-wait' : ''}`}
            >
              <span>{loadingRole === p.role ? 'Launching Session...' : `Enter ${p.title} Portal`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Security & System Info Pill */}
      <div className="mt-14 w-full max-w-3xl bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span><strong>Microservices:</strong> Node.js API (:5000) • Python Risk Engine (:8000)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>JWT RBAC Enforced</span>
          <span>•</span>
          <span>INR (₹) Formatted</span>
          <span>•</span>
          <span>Vite & Next.js Compatible</span>
        </div>
      </div>
    </div>
  );
}
