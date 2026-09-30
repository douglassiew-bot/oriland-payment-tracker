# Oriland Payment Tracker — PRD

## Problem
A finance team of 4 manually tracks bank balances to ensure sufficient funds before approving payments in Maybank2e (online banking). When a member is away, others can't see the current balance state — risking overdrafts and blocking payments.

## Target user
4 finance team members; replaces 1 executive-level role dedicated to manual balance tracking and payment approval checks.

## Core objects
- **Bank account** — name, account number, opening balance.
- **Payment** — outflow: payee, invoice ref, payment voucher number, amount, date, cleared checkbox (settled in Maybank2e).
- **Receipt** — inflow: source, reference, amount, date, cleared checkbox.
- **Available balance** — derived: opening balance + cleared receipts − payments (all, since committed).

## MVP (v1) — checklist
- [ ] List bank accounts with live available balance per account.
- [ ] Add / edit / delete payments (with cleared toggle).
- [ ] Add / edit / delete receipts (with cleared toggle).
- [ ] Available balance recalculates instantly after any change.
- [ ] Insufficient-balance alert on payment creation: if new payment exceeds available balance, show clear warning "Do not approve in Maybank2e — insufficient balance."
- [ ] All screens render for anonymous visitors with seeded demo data (no login wall).
- [ ] Responsive: sidebar nav on desktop, hamburger on mobile.

## Non-goals (v1)
- No actual bank API integration or Maybank2e automation.
- No payment execution or fund transfers.
- No user authentication or per-user data isolation (deferred to lock-down sprint).
- No multi-tenant SaaS.

## Success criteria
A team member opens the app (no login), sees the available balance for the Maybank operating account, creates a new payment for RM 15,000; the available balance drops to −RM 2,300 and a red alert appears: "Insufficient balance. Do NOT approve this payment in Maybank2e." The member can instead reduce the amount or delete a draft payment to restore positive balance.
