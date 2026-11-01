/**
 * Rio Banking In-Memory Reactive Data Store
 * Provides live state management for demo sessions
 */
const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'seed.json');
const rawSeed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = JSON.parse(JSON.stringify(rawSeed.users));
    this.customers = JSON.parse(JSON.stringify(rawSeed.customers));
    this.approvals = JSON.parse(JSON.stringify(rawSeed.approvals));
    this.transactions = JSON.parse(JSON.stringify(rawSeed.transactions));
  }

  // --- Users & Auth ---
  findUserByEmail(email) {
    return this.users.find(u => u.username.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  // --- Customers (Employee Operations) ---
  getAllCustomers() {
    return this.customers;
  }

  findCustomer(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return this.customers;
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.accountNumber.toLowerCase().includes(q) ||
      c.pan.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  }

  updateCustomerKYC(id, status) {
    const cust = this.customers.find(c => c.id === id);
    if (cust) {
      cust.kycStatus = status;
      return cust;
    }
    return null;
  }

  adjustCustomerBalance(accountNumber, delta) {
    const cust = this.customers.find(c => c.accountNumber === accountNumber);
    if (cust) {
      cust.balance = Math.max(0, cust.balance + delta);
      // Also update user if matches
      const user = this.users.find(u => u.accountNumber === accountNumber);
      if (user) {
        user.balance = cust.balance;
      }
      return cust.balance;
    }
    return null;
  }

  // --- Approvals (Manager Operations) ---
  getAllApprovals() {
    return this.approvals;
  }

  resolveApproval(id, decision, managerName = 'Rajesh Sharma') {
    const app = this.approvals.find(a => a.id === id);
    if (app) {
      app.status = decision; // 'APPROVED' or 'REJECTED'
      app.resolvedBy = managerName;
      app.resolvedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      return app;
    }
    return null;
  }

  // --- Transactions (Customer Operations) ---
  getTransactionsForAccount(accountNumber) {
    return this.transactions.filter(t => t.accountNumber === accountNumber);
  }

  recordTransaction({ accountNumber, title, amount, type, channel, category, riskScore }) {
    const newTx = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      accountNumber,
      title,
      amount: type === 'DEBIT' ? -Math.abs(amount) : Math.abs(amount),
      type,
      channel: channel || 'IMPS Instant',
      category: category || 'Transfer',
      timestamp: 'Just now',
      status: 'COMPLETED',
      riskScore: riskScore || 5,
      balanceAfter: 0
    };

    // Update balance
    const delta = type === 'DEBIT' ? -Math.abs(amount) : Math.abs(amount);
    const newBal = this.adjustCustomerBalance(accountNumber, delta);
    newTx.balanceAfter = newBal !== null ? newBal : 0;

    this.transactions.unshift(newTx);
    return newTx;
  }
}

const store = new DataStore();
module.exports = store;

