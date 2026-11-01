import { User, Customer, ApprovalRequest, Transaction, BranchAnalytics, UserRole } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Seed demo state for standalone Vercel preview
const mockSeed = {
  users: [
    {
      id: "usr_mgr_01",
      username: "rajesh.sharma@riobanking.in",
      name: "Rajesh Sharma",
      role: "manager" as UserRole,
      designation: "Vice President & Branch Manager",
      branch: "Nariman Point Flagship (RIOB0001042)",
      avatar: "RS"
    },
    {
      id: "usr_emp_02",
      username: "priya.nair@riobanking.in",
      name: "Priya Nair",
      role: "employee" as UserRole,
      designation: "Senior Banking Operations Officer",
      branch: "Nariman Point Flagship (RIOB0001042)",
      avatar: "PN"
    },
    {
      id: "usr_cust_03",
      username: "aarav.patel@riobanking.in",
      name: "Aarav Patel",
      role: "customer" as UserRole,
      accountNumber: "RIOB-4091-8821",
      accountType: "Rio Premier Savings",
      balance: 845250.00,
      fdBalance: 1500000.00,
      pan: "ABCDE1234F",
      upiId: "aaravpatel@rio",
      avatar: "AP"
    }
  ],
  customers: [
    {
      id: "cust_101",
      name: "Aarav Patel",
      email: "aarav.patel@riobanking.in",
      phone: "+91 98201 44821",
      accountNumber: "RIOB-4091-8821",
      accountType: "Premier Savings",
      balance: 845250.00,
      city: "Mumbai",
      pan: "ABCDE1234F",
      aadhaar: "•••• •••• 9012",
      kycStatus: "VERIFIED" as const,
      riskCategory: "Low" as const
    },
    {
      id: "cust_102",
      name: "Ananya Desai",
      email: "ananya.desai@techcorp.in",
      phone: "+91 99302 11983",
      accountNumber: "RIOB-5102-3341",
      accountType: "Current Account - Biz",
      balance: 1420000.00,
      city: "Bengaluru",
      pan: "BKSPD8902G",
      aadhaar: "•••• •••• 4123",
      kycStatus: "VERIFIED" as const,
      riskCategory: "Low" as const
    },
    {
      id: "cust_103",
      name: "Vikramaditya Singhania",
      email: "v.singhania@heritageholdings.in",
      phone: "+91 98110 55670",
      accountNumber: "RIOB-9921-0012",
      accountType: "Private Wealth Escrow",
      balance: 12580000.00,
      city: "New Delhi",
      pan: "ZXCVB9912M",
      aadhaar: "•••• •••• 8841",
      kycStatus: "VERIFIED" as const,
      riskCategory: "Medium" as const
    },
    {
      id: "cust_104",
      name: "Sunita Rao",
      email: "sunita.rao@ecolabs.org",
      phone: "+91 97400 22319",
      accountNumber: "RIOB-3312-7749",
      accountType: "Standard Savings",
      balance: 210400.00,
      city: "Hyderabad",
      pan: "MNOPQ3456K",
      aadhaar: "•••• •••• 3392",
      kycStatus: "PENDING_REVERIFICATION" as const,
      riskCategory: "Low" as const
    }
  ],
  approvals: [
    {
      id: "APPR-101",
      type: "High-Value RTGS Release",
      beneficiary: "Tata Steel Subcontractor Consortium",
      accountNumber: "RIOB-5102-3341",
      amount: 3500000.00,
      requester: "Priya Nair (Officer)",
      date: "Today, 10:30 AM",
      status: "PENDING" as const,
      reason: "Quarterly procurement clearance",
      riskRating: "Medium (₹35L)"
    },
    {
      id: "APPR-102",
      type: "Commercial OD Limit Enhancement",
      beneficiary: "Zomato Quick Logistics Hub",
      accountNumber: "RIOB-9921-0012",
      amount: 1500000.00,
      requester: "Anil Verma (Trade Desk)",
      date: "Today, 11:15 AM",
      status: "PENDING" as const,
      reason: "Festive seasonal inventory buffer",
      riskRating: "Low (Audited Balance Sheet)"
    },
    {
      id: "APPR-103",
      type: "Treasury Escrow Wire",
      beneficiary: "Singhania Heritage Trust",
      accountNumber: "RIOB-9921-0012",
      amount: 4850000.00,
      requester: "Vikramaditya Singhania",
      date: "Today, 12:40 PM",
      status: "PENDING" as const,
      reason: "Commercial property advance settlement",
      riskRating: "High (Dual-Auth Mandate)"
    },
    {
      id: "APPR-104",
      type: "Clean Energy Term Loan Disbursement",
      beneficiary: "EcoLabs Solar Innovations",
      accountNumber: "RIOB-3312-7749",
      amount: 1800000.00,
      requester: "Sunita Rao",
      date: "Yesterday, 04:50 PM",
      status: "PENDING" as const,
      reason: "Equipment acquisition tranche 2",
      riskRating: "Medium (Collateral Pledged)"
    }
  ],
  transactions: [
    {
      id: "TXN-9941",
      accountNumber: "RIOB-4091-8821",
      title: "Infosys Ltd - Monthly Salary",
      amount: 285000.00,
      type: "CREDIT" as const,
      channel: "NEFT",
      category: "Salary",
      timestamp: "Today, 06:15 AM",
      status: "COMPLETED",
      balanceAfter: 845250.00
    },
    {
      id: "TXN-9938",
      accountNumber: "RIOB-4091-8821",
      title: "Tata Power Mumbai Electricity Bill",
      amount: -4320.00,
      type: "DEBIT" as const,
      channel: "Bharat BillPay",
      category: "Utilities",
      timestamp: "Today, 09:30 AM",
      status: "COMPLETED",
      balanceAfter: 560250.00
    },
    {
      id: "TXN-9932",
      accountNumber: "RIOB-4091-8821",
      title: "Swiggy Gourmet Diners",
      amount: -1850.00,
      type: "DEBIT" as const,
      channel: "UPI / PhonePe",
      category: "Dining",
      timestamp: "Yesterday, 08:45 PM",
      status: "COMPLETED",
      balanceAfter: 564570.00
    },
    {
      id: "TXN-9925",
      accountNumber: "RIOB-4091-8821",
      title: "HDFC Top 100 Equity Mutual Fund SIP",
      amount: -25000.00,
      type: "DEBIT" as const,
      channel: "Auto-Debit NACH",
      category: "Investments",
      timestamp: "28 Oct 2026",
      status: "COMPLETED",
      balanceAfter: 566420.00
    },
    {
      id: "TXN-9918",
      accountNumber: "RIOB-4091-8821",
      title: "Reliance Retail Smart Bazaar",
      amount: -6410.00,
      type: "DEBIT" as const,
      channel: "Rio Platinum RuPay",
      category: "Groceries",
      timestamp: "27 Oct 2026",
      status: "COMPLETED",
      balanceAfter: 591420.00
    },
    {
      id: "TXN-9904",
      accountNumber: "RIOB-4091-8821",
      title: "Quarterly Savings Interest Credit",
      amount: 14280.00,
      type: "CREDIT" as const,
      channel: "System Automated",
      category: "Interest",
      timestamp: "25 Oct 2026",
      status: "COMPLETED",
      balanceAfter: 597830.00
    }
  ]
};

// Local storage reactive state
let localStore = { ...mockSeed };

export function getCachedUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('rio_user');
  return userJson ? JSON.parse(userJson) : null;
}

export function setCachedUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rio_user', JSON.stringify(user));
  }
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rio_token');
    localStorage.removeItem('rio_user');
  }
}

export const api = {
  async login(roleOrUsername: string): Promise<{ user: User; token: string }> {
    try {
      const isRole = ['manager', 'employee', 'customer'].includes(roleOrUsername);
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRole ? { role: roleOrUsername } : { username: roleOrUsername })
      });
      if (res.ok) {
        const data = await res.json();
        setCachedUser(data.user);
        return data;
      }
    } catch (e) {
      // Fallback to local store for Vercel preview
    }

    const user = localStore.users.find(u => u.role === roleOrUsername || u.username === roleOrUsername) || localStore.users[0];
    setCachedUser(user);
    return { user, token: 'mock_jwt_token' };
  },

  async logout(): Promise<void> {
    removeToken();
  },

  async getManagerAnalytics(): Promise<BranchAnalytics> {
    try {
      const res = await fetch(`${API_BASE}/manager/analytics`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {}

    const pendingCount = localStore.approvals.filter(a => a.status === 'PENDING').length;
    return {
      branch: { name: 'Rio Nariman Point Flagship', code: 'RIOB0001042', city: 'Mumbai', zone: 'Western Metro' },
      metrics: {
        total_aum_inr: 8425000000,
        total_aum_formatted: '₹842.50 Cr',
        active_accounts: 14280,
        today_turnover_inr: 124800000,
        today_turnover_formatted: '₹12.48 Cr',
        settlement_success_rate: 99.84
      },
      pendingApprovalsCount: pendingCount,
      totalCustomersManaged: localStore.customers.length,
      channel_breakdown: [
        { channel: 'UPI / QR', percentage: 48, volume_inr: 59904000 },
        { channel: 'NEFT / RTGS', percentage: 34, volume_inr: 42432000 },
        { channel: 'IMPS Instant', percentage: 14, volume_inr: 17472000 },
        { channel: 'Branch Cash / Cheque', percentage: 4, volume_inr: 4992000 }
      ],
      risk_distribution: { low_risk: 96.2, medium_risk: 3.1, high_risk: 0.7 }
    };
  },

  async getApprovals(): Promise<ApprovalRequest[]> {
    try {
      const res = await fetch(`${API_BASE}/manager/approvals`);
      if (res.ok) {
        const data = await res.json();
        return data.approvals;
      }
    } catch (e) {}
    return localStore.approvals;
  },

  async decideApproval(id: string, decision: 'APPROVED' | 'REJECTED'): Promise<ApprovalRequest> {
    try {
      const res = await fetch(`${API_BASE}/manager/approvals/${id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      if (res.ok) {
        const data = await res.json();
        return data.approval;
      }
    } catch (e) {}

    const app = localStore.approvals.find(a => a.id === id);
    if (app) {
      app.status = decision;
      app.resolvedBy = 'Rajesh Sharma';
      app.resolvedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      return app;
    }
    throw new Error('Approval not found');
  },

  async getCustomers(query: string = ''): Promise<Customer[]> {
    try {
      const res = await fetch(`${API_BASE}/employee/customers?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        return data.customers;
      }
    } catch (e) {}

    const q = query.toLowerCase().trim();
    if (!q) return localStore.customers;
    return localStore.customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.accountNumber.toLowerCase().includes(q) ||
      c.pan.toLowerCase().includes(q)
    );
  },

  async updateCustomerKYC(id: string, status: 'VERIFIED' | 'PENDING_REVERIFICATION' | 'FLAGGED'): Promise<Customer> {
    try {
      const res = await fetch(`${API_BASE}/employee/customers/${id}/kyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const data = await res.json();
        return data.customer;
      }
    } catch (e) {}

    const c = localStore.customers.find(cust => cust.id === id);
    if (c) {
      c.kycStatus = status;
      return c;
    }
    throw new Error('Customer not found');
  },

  async processCashOperation(payload: { accountNumber: string; amount: number; operationType: 'DEPOSIT' | 'WITHDRAWAL' }) {
    try {
      const res = await fetch(`${API_BASE}/employee/operations/cash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const c = localStore.customers.find(cust => cust.accountNumber === payload.accountNumber);
    if (!c) throw new Error('Account not found');
    const delta = payload.operationType === 'DEPOSIT' ? payload.amount : -payload.amount;
    c.balance = Math.max(0, c.balance + delta);

    const tx: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNumber: payload.accountNumber,
      title: `Branch Counter Cash ${payload.operationType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}`,
      amount: payload.amount,
      type: payload.operationType === 'DEPOSIT' ? 'CREDIT' : 'DEBIT',
      channel: 'Branch Cash Counter',
      category: 'Cash Operation',
      timestamp: 'Just now',
      status: 'COMPLETED',
      balanceAfter: c.balance
    };
    localStore.transactions.unshift(tx);
    return { message: `Cash ${payload.operationType.toLowerCase()} of ₹${payload.amount.toLocaleString('en-IN')} processed successfully.`, newBalance: c.balance, transaction: tx };
  },

  async getCustomerAccount() {
    try {
      const res = await fetch(`${API_BASE}/customer/account`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const user = localStore.users.find(u => u.role === 'customer')!;
    const c = localStore.customers.find(cust => cust.accountNumber === user.accountNumber);
    return {
      account: {
        accountNumber: user.accountNumber,
        holderName: user.name,
        email: user.username,
        accountType: user.accountType,
        balance: c ? c.balance : user.balance,
        fdBalance: user.fdBalance,
        upiId: user.upiId,
        pan: user.pan,
        ifsc: 'RIOB0001042',
        branch: 'Nariman Point Flagship, Mumbai',
        kycStatus: c ? c.kycStatus : 'VERIFIED'
      }
    };
  },

  async getTransactions(): Promise<Transaction[]> {
    try {
      const res = await fetch(`${API_BASE}/customer/transactions`);
      if (res.ok) {
        const data = await res.json();
        return data.transactions;
      }
    } catch (e) {}
    return localStore.transactions;
  },

  async transferFunds(payload: { recipient: string; amount: number; channel: string; category: string }) {
    try {
      const res = await fetch(`${API_BASE}/customer/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const cust = localStore.customers[0];
    if (cust.balance < payload.amount) {
      throw new Error(`Insufficient funds. Balance: ₹${cust.balance.toLocaleString('en-IN')}`);
    }
    cust.balance -= payload.amount;

    const tx: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNumber: cust.accountNumber,
      title: `Transfer to ${payload.recipient} (${payload.channel})`,
      amount: -payload.amount,
      type: 'DEBIT',
      channel: payload.channel,
      category: payload.category,
      timestamp: 'Just now',
      status: 'COMPLETED',
      balanceAfter: cust.balance
    };
    localStore.transactions.unshift(tx);
    return {
      message: `₹${payload.amount.toLocaleString('en-IN')} transferred successfully to ${payload.recipient}`,
      transaction: tx,
      newBalance: cust.balance,
      riskEvaluation: { risk_score: 10, status: 'ALLOW' }
    };
  }
};
