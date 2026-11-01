const express = require('express');
const store = require('../data/store');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const DATA_SERVICE_URL = process.env.DATA_SERVICE_URL || 'http://127.0.0.1:8000';

// Customer route protection
router.use(verifyToken, requireRole(['customer']));

// GET /api/v1/customer/account
router.get('/account', (req, res) => {
  const user = store.findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Customer account not found' });
  }

  const customerRecord = store.customers.find(c => c.accountNumber === user.accountNumber);

  res.json({
    success: true,
    account: {
      accountNumber: user.accountNumber,
      holderName: user.name,
      email: user.username,
      accountType: user.accountType,
      balance: customerRecord ? customerRecord.balance : user.balance,
      fdBalance: user.fdBalance || 1500000.00,
      upiId: user.upiId || 'aaravpatel@rio',
      pan: user.pan || 'ABCDE1234F',
      ifsc: 'RIOB0001042',
      branch: 'Nariman Point Flagship, Mumbai',
      kycStatus: customerRecord ? customerRecord.kycStatus : 'VERIFIED'
    }
  });
});

// GET /api/v1/customer/transactions
router.get('/transactions', (req, res) => {
  const txs = store.getTransactionsForAccount(req.user.accountNumber);
  res.json({
    success: true,
    count: txs.length,
    transactions: txs
  });
});

// POST /api/v1/customer/transfer
router.post('/transfer', async (req, res) => {
  const { recipient, amount, channel, category, beneficiaryBank } = req.body;
  const num = parseFloat(amount);

  if (!recipient || !num || num <= 0) {
    return res.status(400).json({ success: false, error: 'Recipient and a positive transfer amount are required' });
  }

  const user = store.findUserById(req.user.userId);
  const currentCustomer = store.customers.find(c => c.accountNumber === user.accountNumber);
  const currentBalance = currentCustomer ? currentCustomer.balance : user.balance;

  if (currentBalance < num) {
    return res.status(400).json({
      success: false,
      error: `Insufficient available funds. Current balance: ₹${currentBalance.toLocaleString('en-IN')}`
    });
  }

  // Evaluate risk with Python Microservice
  let riskDecision = { risk_score: 10, status: 'ALLOW', flags: [] };
  try {
    const riskRes = await fetch(`${DATA_SERVICE_URL}/api/v1/evaluate-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        amount: num,
        recipient,
        channel: channel || 'IMPS'
      }),
      signal: AbortSignal.timeout(2000)
    });

    if (riskRes.ok) {
      riskDecision = await riskRes.json();
    }
  } catch (err) {
    // Graceful fallback heuristics if microservice is offline
    if (num >= 1000000) {
      riskDecision = { risk_score: 75, status: 'BLOCK', flags: ['High-Value Dual-Auth Required (> ₹10L)'] };
    } else if (num >= 200000) {
      riskDecision = { risk_score: 45, status: 'FLAGGED', flags: ['OTP Verification Threshold (> ₹2L)'] };
    }
  }

  if (riskDecision.status === 'BLOCK') {
    return res.status(403).json({
      success: false,
      error: 'Transfer blocked by Rio Autonomous Fraud Shield: High-value transaction requires branch executive clearance.',
      riskScore: riskDecision.risk_score,
      flags: riskDecision.flags
    });
  }

  // Record debit transaction
  const tx = store.recordTransaction({
    accountNumber: user.accountNumber,
    title: `Transfer to ${recipient} (${channel || 'IMPS'})`,
    amount: num,
    type: 'DEBIT',
    channel: channel || 'IMPS Instant',
    category: category || 'Transfer',
    riskScore: riskDecision.risk_score
  });

  res.json({
    success: true,
    message: `₹${num.toLocaleString('en-IN')} transferred successfully to ${recipient}`,
    transaction: tx,
    newBalance: tx.balanceAfter,
    riskEvaluation: riskDecision
  });
});

module.exports = router;

