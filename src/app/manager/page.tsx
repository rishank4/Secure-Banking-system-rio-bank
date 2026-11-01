'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ApprovalRequest, BranchAnalytics } from '@/types';
import { formatINR } from '@/lib/utils';
import StatsCard from '@/components/common/StatsCard';
import StatusBadge from '@/components/common/StatusBadge';
import { 
  Building2, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  Check, 
  X, 
  RefreshCw,
  PieChart,
  Layers
} from 'lucide-react';

export default function ManagerDashboard() {
  const [analytics, setAnalytics] = useState<BranchAnalytics | null>(null);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, approvalsData] = await Promise.all([
        api.getManagerAnalytics().catch(() => null),
        api.getApprovals().catch(() => [])
      ]);
      if (analyticsData) setAnalytics(analyticsData);
      setApprovals(approvalsData);
    } catch (err) {
      console.error('Error fetching manager telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      setActionLoading(id);
      const updated = await api.decideApproval(id, decision);
      setApprovals(prev => prev.map(a => a.id === id ? updated : a));
      setFeedback(`Successfully marked ${id} as ${decision}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(`Error: ${err.message || 'Action failed'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const resolvedApprovals = approvals.filter(a => a.status !== 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Branch Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              Executive Console
            </span>
            <span className="text-xs text-slate-400">Branch ID: RIOB0001042</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Nariman Point Flagship Branch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manager: Rajesh Sharma • Real-time telemetry synced with Python Risk Engine
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-indigo-400 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Branch AUM"
          value={analytics?.metrics?.total_aum_formatted || '₹842.50 Cr'}
          subtitle="Across 14,280 accounts"
          change="+8.4% YoY"
          changeType="positive"
          icon={<Building2 className="w-5 h-5" />}
        />
        <StatsCard
          title="Today's Turnover"
          value={analytics?.metrics?.today_turnover_formatted || '₹12.48 Cr'}
          subtitle="RTGS / NEFT / UPI"
          change="₹1.2 Cr in last hr"
          changeType="neutral"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />
        <StatsCard
          title="Settlement Success"
          value={`${analytics?.metrics?.settlement_success_rate || 99.84}%`}
          subtitle="RBI NACH & IMPS Grid"
          change="Optimal"
          changeType="positive"
          icon={<CheckCircle className="w-5 h-5 text-indigo-400" />}
        />
        <StatsCard
          title="Pending Approvals"
          value={`${pendingApprovals.length}`}
          subtitle="High-value dual-control"
          change={pendingApprovals.length > 0 ? "Action Required" : "All Clear"}
          changeType={pendingApprovals.length > 0 ? "negative" : "positive"}
          icon={<Clock className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Main Grid: Approvals Queue + Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approvals Section (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  Dual-Control Approvals Queue
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-value transactions requiring branch manager authorization prior to RTGS execution.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {pendingApprovals.length} Pending
              </span>
            </div>

            {/* Approvals List */}
            <div className="divide-y divide-slate-800/80">
              {approvals.map((req) => (
                <div key={req.id} className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300">{req.id}</span>
                      <StatusBadge status={req.status} />
                      <span className="text-xs text-slate-400">• {req.type}</span>
                    </div>

                    <div className="text-sm font-semibold text-white">
                      {req.beneficiary}
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Reason: <span className="text-slate-300">{req.reason}</span></span>
                      <span>•</span>
                      <span>By: <span className="text-slate-300">{req.requester}</span></span>
                    </div>

                    {req.resolvedBy && (
                      <div className="text-[11px] text-slate-400 pt-0.5">
                        Resolved by <span className="text-indigo-300 font-medium">{req.resolvedBy}</span> at {req.resolvedAt}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-bold text-white tracking-tight font-mono">
                        {formatINR(req.amount)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        A/C: {req.accountNumber}
                      </div>
                    </div>

                    {req.status === 'PENDING' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecision(req.id, 'APPROVED')}
                          disabled={actionLoading === req.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleDecision(req.id, 'REJECTED')}
                          disabled={actionLoading === req.id}
                          className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-medium text-slate-400">
                        Processed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Breakdown Column */}
        <div className="space-y-6">
          {/* Payment Channel Breakdown */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-indigo-400" />
              Settlement Channels
            </h3>
            <div className="space-y-3.5">
              {(analytics?.channel_breakdown || [
                { channel: 'UPI / QR', percentage: 48, volume_inr: 59904000 },
                { channel: 'NEFT / RTGS', percentage: 34, volume_inr: 42432000 },
                { channel: 'IMPS Instant', percentage: 14, volume_inr: 17472000 },
                { channel: 'Branch Cash / Cheque', percentage: 4, volume_inr: 4992000 }
              ]).map((c) => (
                <div key={c.channel} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{c.channel}</span>
                    <span className="text-slate-400 font-mono">{c.percentage}% ({formatINR(c.volume_inr)})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Risk Engine Health */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Python Risk Engine
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-300">Low Risk (Auto-Cleared)</span>
                <span className="font-bold text-emerald-400 font-mono">96.2%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-300">Medium Risk (Step-up OTP)</span>
                <span className="font-bold text-amber-400 font-mono">3.1%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-300">High Risk (Dual-Auth / Block)</span>
                <span className="font-bold text-rose-400 font-mono">0.7%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 italic">
              Powered by Rio Autonomous Compliance Microservice on port :8000.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

