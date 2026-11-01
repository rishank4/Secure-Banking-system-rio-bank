import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Transaction } from '../../types';
import { formatINR } from '../../lib/utils';
import { 
  Send, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export default function CustomerDashboard() {
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);

  // Transfer modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [channel, setChannel] = useState('IMPS');
  const [category, setCategory] = useState('Transfer');
  const [transferLoading, setTransferLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; safe: boolean; riskScore?: number } | null>(null);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const [accData, txData] = await Promise.all([
        api.getCustomerAccount().catch(() => null),
        api.getTransactions().catch(() => [])
      ]);
      if (accData) setAccount(accData.account);
      setTransactions(txData);
    } catch (err) {
      console.error('Customer data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0 || !recipient) return;

    try {
      setTransferLoading(true);
      const res = await api.transferFunds({
        recipient,
        amount: num,
        channel,
        category
      });

      setAccount((prev: any) => prev ? { ...prev, balance: res.newBalance } : prev);
      setTransactions((prev) => [res.transaction, ...prev]);
      setFeedback({
        message: res.message,
        safe: true,
        riskScore: res.riskEvaluation?.risk_score
      });
      setRecipient('');
      setAmount('');
      setTimeout(() => {
        setModalOpen(false);
        setFeedback(null);
      }, 2500);
    } catch (err: any) {
      setFeedback({
        message: err.message || 'Transfer could not be processed.',
        safe: false
      });
    } finally {
      setTransferLoading(false);
    }
  };

  const filteredTransactions = selectedCategory === 'ALL'
    ? transactions
    : transactions.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ['ALL', 'Salary', 'Utilities', 'Dining', 'Investments', 'Groceries', 'Cash Operation'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Account Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              Rio Premier NetBanking
            </span>
            <span className="text-xs text-slate-400">IFSC: RIOB0001042</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Welcome back, {account?.holderName || 'Aarav Patel'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            A/C: {account?.accountNumber || 'RIOB-4091-8821'} • UPI: {account?.upiId || 'aaravpatel@rio'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-950"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Money</span>
          </button>

          <button
            onClick={loadCustomerData}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            title="Refresh Account"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Balance & Asset Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Primary Savings Portfolio
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title={showBalance ? "Hide balance" : "Show balance"}
              >
                {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Active • KYC Verified
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono mb-6">
            {showBalance ? formatINR(account?.balance ?? 845250) : '₹••••••••'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Account Tier</span>
              <span className="font-semibold text-slate-200">Reserve Premier</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Annual Yield</span>
              <span className="font-semibold text-emerald-400">6.85% p.a.</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Daily UPI Limit</span>
              <span className="font-semibold text-slate-200">₹1,00,000</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Debit Card</span>
              <span className="font-semibold text-slate-200 font-mono">•••• 8821</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Fixed Deposit Tranche
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                7.25% p.a.
              </span>
            </div>

            <div className="text-2xl font-bold text-white tracking-tight font-mono mb-1">
              {showBalance ? formatINR(account?.fdBalance ?? 1500000) : '₹••••••••'}
            </div>
            <p className="text-xs text-slate-400">
              Maturity Date: 15 Mar 2028 • Compounded Quarterly
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Autonomous Tax Deducted (TDS)</span>
            <span className="font-mono text-emerald-400">10% Active</span>
          </div>
        </div>
      </div>

      {/* Digital Passbook / History */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Live Digital Passbook
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant statement with RBI clearing codes and category classifications.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredTransactions.map((tx) => {
            const isCredit = tx.type === 'CREDIT';
            return (
              <div key={tx.id} className="py-4 first:pt-2 last:pb-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${
                    isCredit
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      {tx.title}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{tx.channel}</span>
                      <span>•</span>
                      <span className="font-mono">{tx.timestamp}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300">
                        {tx.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-bold font-mono tracking-tight ${
                    isCredit ? 'text-emerald-400' : 'text-slate-100'
                  }`}>
                    {isCredit ? '+' : '-'}{formatINR(Math.abs(tx.amount))}
                  </div>
                  {tx.balanceAfter > 0 && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      Bal: {formatINR(tx.balanceAfter)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-500">
              No transactions found for filter "{selectedCategory}".
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Send Money via Rio NetBanking</h3>
                  <p className="text-xs text-slate-400">Real-time IMPS / NEFT / UPI transfer</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {feedback && (
              <div className={`p-3 rounded-xl border text-xs font-medium mb-4 ${
                feedback.safe ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {feedback.message}
                {feedback.riskScore !== undefined && (
                  <div className="text-[11px] mt-1 font-mono">
                    Autonomous Risk Score: {feedback.riskScore}/100 (Safe)
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Recipient (Name / UPI ID / A/C)</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. ananya.desai@techcorp.in or 99210012"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Transfer Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Available: {formatINR(account?.balance ?? 845250)}</span>
                  {parseFloat(amount) >= 200000 && (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Requires High-Value OTP check
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Payment Rail</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="IMPS">IMPS Instant (24x7)</option>
                    <option value="NEFT">NEFT Hourly</option>
                    <option value="UPI">UPI / QR Rail</option>
                    <option value="RTGS">RTGS High-Value</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Transfer">Transfer</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Dining">Dining</option>
                    <option value="Investments">Investments</option>
                    <option value="Salary">Salary / Payroll</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={transferLoading || !amount || !recipient}
                className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-950/50 disabled:opacity-50"
              >
                {transferLoading ? 'Evaluating Risk & Clearing IMPS...' : `Authorize & Send ${amount ? formatINR(parseFloat(amount)) : ''}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
