# Intelligence Layer

## v1: Rule-based only (no AI)
All logic is deterministic arithmetic and thresholds. No model calls needed.

## Messy inputs (later)
Free-text payment descriptions, inconsistent payee names, manual receipt entry with typos.

## Auto-structure schema (later, example)
```json
{
  "raw_input": "Payment to Synergy Solutions Sdn Bhd inv SYN-2025-0312 RM8500",
  "structured": {
    "payee": "Synergy Solutions Sdn Bhd",
    "invoice_ref": "SYN-2025-0312",
    "amount": 8500.00
  },
  "source": "text-parser-v1",
  "confidence": 0.92,
  "review_status": "unreviewed"
}
```

## Events to track
- payment_created, payment_edited, payment_deleted, payment_cleared
- receipt_created, receipt_edited, receipt_deleted, receipt_cleared
- balance_alert_triggered (with shortfall amount)
- account_opening_balance_changed

## Scoring rules (v1, rule-based)
| Rule | Trigger | Action |
|------|---------|--------|
| Insufficient balance | available_balance < 0 after new payment | Red alert: "Do NOT approve in Maybank2e" |
| Low balance warning | available_balance < 10% of opening balance | Yellow warning banner |
| Uncleared payment stale | payment.cleared = false AND payment_date > 3 days ago | Reminder badge on payment row |

## What gets ranked
Payment priority list (later): rank pending payments by amount (largest first) and urgency (overdue date first). Not in v1.

## v1 vs later
**v1:** insufficient-balance alert + low-balance warning + stale-uncleared reminder. All rule-based.
**Later:** anomaly detection (unusual payee, amount spike), spend pattern forecasting, auto-structured free-text entry with confidence + review.