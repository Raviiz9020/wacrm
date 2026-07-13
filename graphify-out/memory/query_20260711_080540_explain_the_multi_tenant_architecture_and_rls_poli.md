---
type: "query"
date: "2026-07-11T08:05:40.592760+00:00"
question: "Explain the multi-tenant architecture and RLS policies defined in 017_account_sharing.sql"
contributor: "graphify"
source_nodes: ["Account", "profiles"]
---

# Q: Explain the multi-tenant architecture and RLS policies defined in 017_account_sharing.sql

## Answer

Expanded from original query via vocab: [account, policy, supabase]. The migration 017_account_sharing.sql transitions wacrm to multi-tenant-per-account. It creates the accounts table and extends profiles with account_id and account_role. A central SECURITY DEFINER helper function is_account_member(account_id, min_role) evaluates user permissions using an ordinal CASE mapping (owner=4, admin=3, agent=2, viewer=1), avoiding recursive RLS checks on profiles. Tenancy is enforced via 3 policy tiers: viewer (SELECT on domain data), agent (INSERT/UPDATE/DELETE on operational tables), and admin (writes on settings-class tables like whatsapp_config). A backfill block atomic-populates accounts for existing profiles and propagates account_id to 15 parent tables.

## Source Nodes

- Account
- profiles