export type UserRole = 'manager' | 'employee' | 'customer';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  designation?: string;
  branch?: string;
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  fdBalance?: number;
  upiId?: string;
  pan?: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  city: string;
  pan: string;
  aadhaar: string;
  kycStatus: 'VERIFIED' | 'PENDING_REVERIFICATION' | 'FLAGGED';
  riskCategory: 'Low' | 'Medium' | 'High';
}

export interface ApprovalRequest {
  id: string;
  type: string;
  beneficiary: string;
  accountNumber: string;
  amount: number;
  requester: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  riskRating: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface Transaction {
  id: string;
  accountNumber: string;
  title: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  channel: string;
  category: string;
  timestamp: string;
  status: string;
  balanceAfter: number;
  riskScore?: number;
}

export interface BranchAnalytics {
  branch: {
    name: string;
    code: string;
    city: string;
    zone: string;
  };
  metrics: {
    total_aum_inr: number;
    total_aum_formatted: string;
    active_accounts: number;
    today_turnover_inr: number;
    today_turnover_formatted: string;
    settlement_success_rate: number;
  };
  pendingApprovalsCount: number;
  totalCustomersManaged: number;
  channel_breakdown: Array<{
    channel: string;
    percentage: number;
    volume_inr: number;
  }>;
  risk_distribution: {
    low_risk: number;
    medium_risk: number;
    high_risk: number;
  };
}

