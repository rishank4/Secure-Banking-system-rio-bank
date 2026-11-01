import React, { useState } from 'react';
import RioLogo from './RioLogo';
import { User, UserRole } from '../../types';
import { ShieldCheck, ArrowRightLeft, LogOut, ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  onSelectRole: (role: UserRole) => void;
  onLogout: () => void;
  onGoHome: () => void;
}

export default function Navbar({ user, activeTab, onSelectRole, onLogout, onGoHome }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roleColors: Record<UserRole, { badge: string; border: string }> = {
    manager: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', border: 'hover:border-amber-500/50' },
    employee: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', border: 'hover:border-emerald-500/50' },
    customer: { badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', border: 'hover:border-indigo-500/50' },
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Rio Brand */}
        <RioLogo size="sm" onClick={onGoHome} />

        {/* Demo Fast Navigation & Active User */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/70 text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-all shadow-sm"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Demo Switcher</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onSelectRole('manager');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      Rajesh Sharma
                    </div>
                    <div className="text-[11px] text-slate-400">Branch Manager (Approvals & AUM)</div>
                  </div>
                  {user?.role === 'manager' && <Check className="w-4 h-4 text-amber-400" />}
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onSelectRole('employee');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs transition-colors mt-1"
                >
                  <div>
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Priya Nair
                    </div>
                    <div className="text-[11px] text-slate-400">Senior Officer (Customer 360 & KYC)</div>
                  </div>
                  {user?.role === 'employee' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onSelectRole('customer');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-xs transition-colors mt-1"
                >
                  <div>
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      Aarav Patel
                    </div>
                    <div className="text-[11px] text-slate-400">Premier Wealth Client (₹8.45L)</div>
                  </div>
                  {user?.role === 'customer' && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              </div>
            )}
          </div>

          {/* Current User Badge */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className={`px-2.5 py-1 rounded-md border text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${roleColors[user.role]?.badge || 'bg-slate-800 text-slate-300'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user.role}</span>
              </div>
              <span className="text-xs text-slate-300 font-medium hidden md:inline">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onGoHome}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
