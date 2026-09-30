# Test Plan

## v1 success scenario (manual)
1. Open app in browser (no login). Verify bank accounts list loads with seeded data.
2. Confirm "Maybank Operating Account" shows available balance = opening + receipts − payments.
3. Click Payments → New Payment. Enter: account = Maybank Operating, payee = "Test Vendor Sdn Bhd", invoice_ref = "TV-001", amount = RM 50,000, date = today.
4. Submit. Verify red alert banner: "Insufficient balance. Do NOT approve this payment in Maybank2e. Shortfall: RM X,XXX."
5. Verify available balance on account card updated (negative).
6. Delete the test payment. Verify balance restored to positive.
7. Create a payment within balance. Verify green success, no alert.
8. Toggle cleared checkbox on a payment. Verify cleared_date is set.

## Empty states
9. Delete all payments (or use a fresh account). Verify payments page shows: "No payments yet. Create your first payment."
10. Delete all receipts. Verify receipts page shows empty state with CTA.

## Error states
11. Disconnect network, reload page. Verify error state with retry button.
12. Submit payment with amount = 0 or negative. Verify validation error (client + server).

## Loading states
13. Slow network (DevTools throttle). Verify skeleton placeholders render on list pages.

## Responsive
14. Resize to mobile width. Verify sidebar collapses to hamburger menu.
15. Open hamburger menu. Verify all sections accessible.
16. Create payment on mobile. Verify form is usable.

## Data integrity
17. Create receipt, verify available balance increases by exact amount.
18. Edit payment amount. Verify available balance reflects new amount.
19. Delete a receipt. Verify balance decreases correctly.
20. Refresh page. Verify all values identical (server-derived, not cached).