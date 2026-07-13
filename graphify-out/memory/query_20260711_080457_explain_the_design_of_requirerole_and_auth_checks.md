---
type: "query"
date: "2026-07-11T08:04:57.257096+00:00"
question: "Explain the design of requireRole and auth checks in account.ts and roles.ts"
contributor: "graphify"
source_nodes: ["requireRole()", "getCurrentAccount()", "roleRank()"]
---

# Q: Explain the design of requireRole and auth checks in account.ts and roles.ts

## Answer

Expanded from original query via vocab: [account, auth, check, require, role, roles]. The requireRole and auth checks are implemented in account.ts and roles.ts. roles.ts defines the ordinal AccountRole hierarchy (owner=4, admin=3, agent=4, viewer=1) and capability predicates (canSendMessages, canEditSettings, etc.) that align with SQL/RLS checks. account.ts provides getCurrentAccount() which resolves Supabase auth.getUser() and the profile + account context in a single round-trip point lookup (robust against PostgREST schema cache staleness). requireRole(min) wraps getCurrentAccount to enforce minimum role checks.

## Source Nodes

- requireRole()
- getCurrentAccount()
- roleRank()