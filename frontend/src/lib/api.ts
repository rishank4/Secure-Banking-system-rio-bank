import { User, Customer, ApprovalRequest, Transaction, BranchAnalytics, UserRole } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rio_token');
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rio_token', token);
  }
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rio_token');
    localStorage.removeItem('rio_user');
  }
}

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

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data.error || 'A banking service communication error occurred.');
  }

  return data as T;
}

export const api = {
  // Auth
  async login(roleOrUsername: string): Promise<{ user: User; token: string }> {
    const isRole = ['manager', 'employee', 'customer'].includes(roleOrUsername);
    const body = isRole ? { role: roleOrUsername } : { username: roleOrUsername };

    const data = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    setToken(data.token);
    setCachedUser(data.user);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  async getMe(): Promise<User> {
    const data = await request<{ user: User }>('/auth/me');
    setCachedUser(data.user);
    return data.user;
  },

  // Manager APIs
  async getManagerAnalytics(): Promise<BranchAnalytics> {
    const data = await request<{ data: BranchAnalytics }>('/manager/analytics');
    return data.data;
  },

  async getApprovals(): Promise<ApprovalRequest[]> {
    const data = await request<{ approvals: ApprovalRequest[] }>('/manager/approvals');
    return data.approvals;
  },

  async decideApproval(id: string, decision: 'APPROVED' | 'REJECTED'): Promise<ApprovalRequest> {
    const data = await request<{ approval: ApprovalRequest }>(`/manager/approvals/${id}/decide`, {
      method: 'POST',
      body: JSON.stringify({ decision })
    });
    return data.approval;
  },

  // Employee APIs
  async getCustomers(query: string = ''): Promise<Customer[]> {
    const data = await request<{ customers: Customer[] }>(`/employee/customers?query=${encodeURIComponent(query)}`);
    return data.customers;
  },

  async updateCustomerKYC(id: string, status: 'VERIFIED' | 'PENDING_REVERIFICATION' | 'FLAGGED'): Promise<Customer> {
    const data = await request<{ customer: Customer }>(`/employee/customers/${id}/kyc`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
    return data.customer;
  },

  async processCashOperation(payload: { accountNumber: string; amount: number; operationType: 'DEPOSIT' | 'WITHDRAWAL' }) {
    return request<{ message: string; newBalance: number; transaction: Transaction }>('/employee/operations/cash', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Customer APIs
  async getCustomerAccount() {
    return request<{ account: any }>('/customer/account');
  },

  async getTransactions(): Promise<Transaction[]> {
    const data = await request<{ transactions: Transaction[] }>('/customer/transactions');
    return data.transactions;
  },

  async transferFunds(payload: { recipient: string; amount: number; channel: string; category: string }) {
    return request<{ message: string; transaction: Transaction; newBalance: number; riskEvaluation: any }>(
      '/customer/transfer',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
  }
};

