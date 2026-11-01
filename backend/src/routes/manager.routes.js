const express = require('express');
const store = require('../data/store');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const DATA_SERVICE_URL = process.env.DATA_SERVICE_URL || 'http://127.0.0.1:8000';

// Manager-only protection
router.use(verifyToken, requireRole(['manager']));

// GET /api/v1/manager/analytics
router.get('/analytics', async (req, res) => {
  let pythonSummary = null;
  try {
    const resp = await fetch(`${DATA_SERVICE_URL}/api/v1/analytics/branch-summary`, {
      signal: AbortSignal.timeout(2000)
    });
    if (resp.ok) {
      pythonSummary = await resp.json();
    }
  } catch (err) {
    // Fallback if data service isn't running
    pythonSummary = {
      branch: { name: 'Rio Nariman Point Flagship', code: 'RIOB0001042', city: 'Mumbai' },
      metrics: {
        total_aum_formatted: '₹842.50 Cr',
        active_accounts: 14280,
        today_turnover_formatted: '₹12.48 Cr',
        settlement_success_rate: 99.84
      },
      channel_breakdown: [
        { channel: 'UPI / QR', percentage: 48, volume_inr: 59904000 },
        { channel: 'NEFT / RTGS', percentage: 34, volume_inr: 42432000 },
        { channel: 'IMPS Instant', percentage: 14, volume_inr: 17472000 },
        { channel: 'Branch Cash / Cheque', percentage: 4, volume_inr: 4992000 }
      ],
      risk_distribution: { low_risk: 96.2, medium_risk: 3.1, high_risk: 0.7 }
    };
  }

  const approvals = store.getAllApprovals();
  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;

  res.json({
    success: true,
    data: {
      ...pythonSummary,
      pendingApprovalsCount: pendingCount,
      totalCustomersManaged: store.getAllCustomers().length
    }
  });
});

// GET /api/v1/manager/approvals
router.get('/approvals', (req, res) => {
  res.json({
    success: true,
    approvals: store.getAllApprovals()
  });
});

// POST /api/v1/manager/approvals/:id/decide
router.post('/approvals/:id/decide', (req, res) => {
  const { decision } = req.body; // 'APPROVED' or 'REJECTED'
  if (!['APPROVED', 'REJECTED'].includes(decision)) {
    return res.status(400).json({ success: false, error: "Decision must be 'APPROVED' or 'REJECTED'" });
  }

  const updated = store.resolveApproval(req.params.id, decision, req.user.name);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Approval request not found' });
  }

  res.json({
    success: true,
    message: `Request ${req.params.id} marked as ${decision}`,
    approval: updated
  });
});

module.exports = router;

