import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Customer } from '../../types';
import { formatINR } from '../../lib/utils';
import StatusBadge from '../common/StatusBadge';
import { 
  Search, 
  UserCheck, 
  CreditCard, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  RefreshCw
} from 'lucide-react';

export default function EmployeeDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Cash Counter Simulator state
  const [opAmount, setOpAmount] = useState('');
  const [opType, setOpType] = useState<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT');
  const [opLoading, setOpLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; safe: boolean } | null>(null);

  const fetchCustomers = async (q = '') => {
    try {
      setLoading(true);
      const data = await api.getCustomers(q);
      setCustomers(data);
      if (data.length > 0 && !selectedCustomer) {
        setSelectedCustomer(data[0]);
      } else if (selectedCustomer) {
        const refreshed = data.find(c => c.id === selectedCustomer.id);
        if (refreshed) setSelectedCustomer(refreshed);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(searchQuery);
  }, [searchQuery]);

  const handleKYCUpdate = async (id: string, newStatus: 'VERIFIED' | 'PENDING_REVERIFICATION') => {
    try {
      const updated = await api.updateCustomerKYC(id, newStatus);
      setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      setSelectedCustomer(updated);
      setFeedback({ message: `Customer KYC status updated to ${newStatus}`, safe: true });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ message: err.message || 'KYC update failed', safe: false });
    }
  };

  const handleCashOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const num = parseFloat(opAmount);
    if (!num || num <= 0) return;

    try {
      setOpLoading(true);
      const res = await api.processCashOperation({
        accountNumber: selectedCustomer.accountNumber,
        amount: num,
        operationType: opType
      });

      setFeedback({ message: res.message, safe: true });
      setOpAmount('');
      await fetchCustomers(searchQuery);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ message: err.message || 'Counter operation failed', safe: false });
    } finally {
      setOpLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              Operations & Customer 360
            </span>
            <span className="text-xs text-slate-400">Desk Officer: Priya Nair</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Customer Operations & KYC Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time Indian demographic lookup, Aadhaar/PAN compliance check, and branch counter simulator.
          </p>
        </div>

        <button
          onClick={() => fetchCustomers(searchQuery)}
          className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between animate-in fade-in ${
          feedback.safe ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)}>✕</button>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Search & Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, A/C (e.g. 4091), or PAN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {customers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-950/30'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {c.name}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{c.accountNumber}</p>
                    </div>
                    <StatusBadge status={c.kycStatus} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="text-slate-400">{c.city} • {c.accountType}</span>
                    <span className="font-bold text-slate-200 font-mono">{formatINR(c.balance)}</span>
                  </div>
                </div>
              );
            })}

            {customers.length === 0 && !loading && (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                No customer records match query "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer 360 */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCustomer ? (
            <>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md">
                      {selectedCustomer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{selectedCustomer.name}</h3>
                      <p className="text-xs text-slate-400">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCustomer.kycStatus === 'PENDING_REVERIFICATION' ? (
                      <button
                        onClick={() => handleKYCUpdate(selectedCustomer.id, 'VERIFIED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Verify Aadhaar/KYC</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleKYCUpdate(selectedCustomer.id, 'PENDING_REVERIFICATION')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        <span>Request Re-verification</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Available Balance</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {formatINR(selectedCustomer.balance)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">PAN Card</span>
                    <span className="text-sm font-semibold text-slate-200 font-mono">
                      {selectedCustomer.pan}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Masked Aadhaar</span>
                    <span className="text-sm font-semibold text-slate-200 font-mono">
                      {selectedCustomer.aadhaar}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Account Type</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {selectedCustomer.accountType}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Branch Location</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {selectedCustomer.city} Metro
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <span className="text-slate-400 block mb-1">Risk Rating</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {selectedCustomer.riskCategory} Risk Tier
                    </span>
                  </div>
                </div>
              </div>

              {/* Branch Cash Counter Simulator */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    Branch Counter Cash Simulator
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Process instant cash deposit or withdrawal directly into {selectedCustomer.name}'s account.
                  </p>
                </div>

                <form onSubmit={handleCashOperation} className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOpType('DEPOSIT')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                        opType === 'DEPOSIT'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Cash Deposit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpType('WITHDRAWAL')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                        opType === 'WITHDRAWAL'
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <ArrowUpFromLine className="w-3.5 h-3.5" />
                      <span>Cash Withdrawal</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Amount in Indian Rupees (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="1"
                        step="100"
                        value={opAmount}
                        onChange={(e) => setOpAmount(e.target.value)}
                        placeholder="e.g. 50000"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={opLoading || !opAmount}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
                  >
                    {opLoading ? 'Executing Counter Voucher...' : `Submit Counter ${opType}`}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              Select a customer on the left to view customer 360 profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
