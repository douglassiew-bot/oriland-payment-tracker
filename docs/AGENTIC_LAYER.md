# Agentic Layer

## v1: No agentic actions
v1 is fully manual — the team enters payments, receipts, and toggles cleared status by hand. The alert is a passive UI banner, not an automated action.

## Later: Draftable actions (low risk — auto)
| Action | Trigger | Risk |
|-------|---------|------|
| Auto-tag payment category | payment created | low — auto |
| Draft receipt from email paste | user pastes remittance text | low — auto, review_status = unreviewed |
| Summarize weekly cash flow | scheduled / on-demand | low — auto |

## Later: Executable-after-approval (medium risk)
| Action | Trigger | Risk |
|-------|---------|------|
| Mark stale payments as flagged | 3+ days uncleared | medium — light approval |
| Suggest balance top-up request | balance < threshold for 2+ days | medium — light approval |

## Human-only (critical)
| Action | Why |
|-------|-----|
| Delete a payment or receipt | data-loss risk |
| Change opening balance | high financial impact |
| Send alert to another team member | external communication |

## Named tools (later)
- `compute_available_balance(account_id)` — read-only, safe.
- `check_balance_alert(account_id, proposed_amount)` — read-only, safe.
- `log_balance_event(event_type, account_id, metadata)` — append-only audit.

No raw `run_any` or `send_any` tools. Only named, scoped functions.

## Audit-log fields (later table)
`id, user_id, action, entity_type, entity_id, metadata jsonb, created_at`

## v1 vs later
**v1:** zero agentic actions, fully manual with passive rule-based alerts.
**Later:** auto-tagging, draft receipts, weekly summaries, stale-payment flagging.