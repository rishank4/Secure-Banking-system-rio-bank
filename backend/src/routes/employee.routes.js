const express = require('express');
const store = require('../data/store');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Protected for employee and manager roles
router.use(verifyToken, requireRole(['employee', 'manager']));

// GET /api/v1/employee/customers?query=...
router.get('/customers', (req, res) => {
  const query = req.query.query || '';
  const results = store.findCustomer(query);
  res.json({
    success: true,
    total: results.length,
    customers: results
  });
});

// POST /api/v1/employee/customers/:id/kyc
router.post('/customers/:id/kyc', (req, res) => {
  const { status } = req.body;
  if (!['VERIFIED', 'PENDING_REVERIFICATION', 'FLAGGED'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid KYC status' });
  }

  const updated = store.updateCustomerKYC(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Customer not found' });
  }

  res.json({
    success: true,
    message: `Customer ${updated.name} KYC updated to ${status}`,
    customer: updated
  });
});

// POST /api/v1/employee/operations/cash
router.post('/operations/cash', (req, res) => {
  const { accountNumber, amount, operationType } = req.body; // DEPOSIT or WITHDRAWAL
  const num = parseFloat(amount);

  if (!accountNumber || !num || num <= 0 || !['DEPOSIT', 'WITHDRAWAL'].includes(operationType)) {
    return res.status(400).json({ success: false, error: 'Valid account, positive amount and operationType required' });
  }

  const delta = operationType === 'DEPOSIT' ? num : -num;
  const newBalance = store.adjustCustomerBalance(accountNumber, delta);

  if (newBalance === null) {
    return res.status(404).json({ success: false, error: 'Target account not found' });
  }

  // Record transaction
  const tx = store.recordTransaction({
    accountNumber,
    title: `Branch Counter Cash ${operationType === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} (Officer ${req.user.name})`,
    amount: num,
    type: operationType === 'DEPOSIT' ? 'CREDIT' : 'DEBIT',
    channel: 'Branch Cash Counter',
    category: 'Cash Operation'
  });

  res.json({
    success: true,
    message: `Cash ${operationType.toLowerCase()} of ₹${num.toLocaleString('en-IN')} processed successfully.`,
    newBalance,
    transaction: tx
  });
});

module.exports = router;

