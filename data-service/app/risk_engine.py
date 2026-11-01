"""
Rio Banking Risk Evaluation Engine
Calibrated for Indian Banking Regulatory Compliance & INR Transactions
"""
from typing import Dict, Any, List

def evaluate_transaction_risk(payload: Dict[str, Any]) -> Dict[str, Any]:
    amount = float(payload.get("amount", 0))
    channel = payload.get("channel", "IMPS").upper() # IMPS, NEFT, RTGS, UPI
    recipient = payload.get("recipient", "")
    flags: List[str] = []
    risk_score = 5 # baseline score

    # Rule 1: High-value INR thresholds (RBI reporting guidelines)
    if amount >= 1000000: # >= ₹10 Lakhs
        risk_score += 65
        flags.append("High-Value Transfer (exceeds ₹10,00,000 threshold - requires Dual-Auth)")
    elif amount >= 200000: # >= ₹2 Lakhs
        risk_score += 35
        flags.append("Elevated Amount (exceeds ₹2,00,000 threshold - requires OTP re-verification)")
    elif amount >= 50000: # >= ₹50,000
        risk_score += 15
        flags.append("Standard PAN Verification tier (> ₹50,000)")

    # Rule 2: Channel-specific velocity limits
    if channel == "UPI" and amount > 100000:
        risk_score += 30
        flags.append("UPI Transaction exceeds NPCI standard daily ceiling (₹1,00,000)")

    # Rule 3: Sanction / High-Risk Recipient Check
    suspicious_patterns = ["OFFSHORE", "CASINO", "BETTING", "UNKNOWN_ESCROW", "CRYPTO_P2P"]
    if any(pattern in recipient.upper() for pattern in suspicious_patterns):
        risk_score += 60
        flags.append(f"Recipient tagged under high-risk surveillance pattern: {recipient}")

    # Determine status
    if risk_score >= 70:
        status = "BLOCK"
    elif risk_score >= 40:
        status = "FLAGGED"
    else:
        status = "ALLOW"

    return {
        "risk_score": min(100, risk_score),
        "status": status,
        "flags": flags,
        "recommendations": (
            "Escalate to Branch Manager" if status == "BLOCK"
            else "Step-up OTP Required" if status == "FLAGGED"
            else "Safe to Process"
        )
    }

