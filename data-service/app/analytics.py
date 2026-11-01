"""
Rio Banking Analytics & Branch Aggregation Engine
"""
from typing import Dict, Any

def get_branch_summary() -> Dict[str, Any]:
    return {
        "branch": {
            "name": "Rio Nariman Point Flagship",
            "code": "RIOB0001042",
            "city": "Mumbai",
            "zone": "Western Metro"
        },
        "metrics": {
            "total_aum_inr": 8425000000, # ₹842.50 Cr
            "total_aum_formatted": "₹842.50 Cr",
            "active_accounts": 14280,
            "today_turnover_inr": 124800000, # ₹12.48 Cr
            "today_turnover_formatted": "₹12.48 Cr",
            "settlement_success_rate": 99.84,
            "pending_approvals_count": 4,
            "flagged_transactions_today": 3
        },
        "channel_breakdown": [
            {"channel": "UPI / QR", "percentage": 48, "volume_inr": 59904000},
            {"channel": "NEFT / RTGS", "percentage": 34, "volume_inr": 42432000},
            {"channel": "IMPS Instant", "percentage": 14, "volume_inr": 17472000},
            {"channel": "Branch Cash / Cheque", "percentage": 4, "volume_inr": 4992000}
        ],
        "risk_distribution": {
            "low_risk": 96.2,
            "medium_risk": 3.1,
            "high_risk": 0.7
        }
    }

