---
type: "query"
date: "2026-07-14T04:34:22.634618+00:00"
question: "What connects $schema, style, rsc to the rest of the system?"
contributor: "graphify"
source_nodes: ["components.json", "$schema", "style", "rsc"]
---

# Q: What connects $schema, style, rsc to the rest of the system?

## Answer

Expanded from original query via vocab: [schema, style, rsc]. Then traversed the graph.

Based on the graph, the nodes `$schema`, `style`, and `rsc` all connect directly to `components.json`. They are contained within `components.json` (at lines L2, L3, and L4, respectively).

From `components.json`, the configuration connects to several other properties, including:
- `aliases`
- `tailwind`
- `rtl`
- `registries`
- `tsx`
- `iconLibrary`
- `menuAccent`
- `menuColor`

In short, they are core properties connecting outward through the UI component configuration file (`components.json`).

## Source Nodes

- components.json
- $schema
- style
- rsc