---
type: "query"
date: "2026-07-11T08:25:46.512576+00:00"
question: "Explain the automations/flows engine architecture in engine.ts, including dispatch, step execution, wait/resume, SSRF guard, and cron drain"
contributor: "graphify"
source_nodes: ["runAutomationsForTrigger()", "executeStepsFrom()", "runStep()", "resumePendingExecution()"]
---

# Q: Explain the automations/flows engine architecture in engine.ts, including dispatch, step execution, wait/resume, SSRF guard, and cron drain

## Answer

The engine has two public entry-points: runAutomationsForTrigger() and resumePendingExecution(). Dispatch: given an accountId + triggerType, the engine first verifies contactId ownership (prevents cross-tenant forgery via service-role client), then queries automations filtered by account_id + trigger_type + is_active, applies triggerMatches() for keyword_match and interactive_reply, then calls executeAutomation() per match. Execution: executeAutomation() creates an automation_logs row and delegates to executeStepsFrom(). executeStepsFrom() loads steps scoped by parent_step_id + branch, iterating with a for-loop. Wait steps suspend: they insert into automation_pending_executions with run_at timestamp and return. Condition steps recurse into executeStepsFrom() for the chosen branch. All other steps dispatch to runStep(). runStep() is a large switch covering: send_message, send_buttons/list, send_template (via meta-send.ts), add_tag, remove_tag, assign_conversation (round-robin stub), update_contact_field (built-in + custom:), create_deal (account default_currency), send_webhook (SSRF guard via isDeliverableUrl, redirect:manual, 10s timeout), close_conversation. Cron drain: GET /api/automations/cron authenticates via AUTOMATION_CRON_SECRET header, queries up to 50 due pending rows ordered by run_at, optimistically claims each via UPDATE status=running WHERE status=pending (cheap soft-lock), then calls resumePendingExecution() which re-runs executeStepsFrom() from next_step_position. Manual trigger: POST /api/automations/engine requires requireRole('agent') and calls runAutomationsForTrigger with the caller's accountId.

## Source Nodes

- runAutomationsForTrigger()
- executeStepsFrom()
- runStep()
- resumePendingExecution()