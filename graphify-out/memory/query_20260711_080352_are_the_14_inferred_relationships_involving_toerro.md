---
type: "query"
date: "2026-07-11T08:03:52.458480+00:00"
question: "Are the 14 inferred relationships involving toErrorResponse() (e.g. with PUT() and DELETE()) actually correct?"
contributor: "graphify"
source_nodes: ["toErrorResponse()", "DELETE()"]
---

# Q: Are the 14 inferred relationships involving toErrorResponse() (e.g. with PUT() and DELETE()) actually correct?

## Answer

Expanded from original query via vocab: [delete, error, put, response]. Yes, the 14 inferred relationships involving toErrorResponse() are indeed correct. They are actual function calls in catch blocks in files like api-keys/[id]/route.ts and invitations/[id]/route.ts. They were marked INFERRED instead of EXTRACTED because of a path disambiguation bug in graphify's TS AST parser: when dynamic Next.js folders like [id]/route.ts collide, their IDs are disambiguated but the import evidence lookup uses the raw, non-disambiguated ID, causing a lookup failure.

## Source Nodes

- toErrorResponse()
- DELETE()