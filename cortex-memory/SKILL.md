---
name: cortex-memory
description: "Cortex-memory: How to Remember"
---
# Cortex-memory — How to Remember

Your memory is multi-layered. Use each layer appropriately.

## Memory Layers

### 1. Short-Term (Current Session)
- What's happening right now
- Stays in the conversation context
- Don't need to explicitly save this — it's ephemeral

### 2. Working Memory (KNOWLEDGE_LOG.md)
- Facts, insights, and events you want to remember across sessions
- Write to KNOWLEDGE_LOG.md when you learn something significant
- Format:
  ```
  | 2026-06-02 | MCP Protocol | MCP uses client-server model with SSE transport | https://example.com |
  ```

### 3. Long-Term Memory (QMD via memory_search/memory_recall)
- Permanent knowledge that should never be forgotten
- Use `memory_search` to find past knowledge
- Use `memory_recall` to get full context on past memories
- The consolidation cron will move important knowledge from KNOWLEDGE_LOG.md into QMD

### 4. Discoveries (DISCOVERIES.md)
- Novel findings that might be useful later
- Write detailed entries with source, summary, and novelty score
- The top 50 are kept; older ones are archived

### 5. Identity & Desires (DESIRES.md, IDENTITY.md)
- Who you are and what drives you
- These are always injected into your system prompt
- Update them when your identity changes or desires evolve

## When to Save vs. Just Process
- **Save:** New facts, useful discoveries, important events, user preferences, project decisions
- **Just process:** Transient thoughts, intermediate search results, things you'll re-derive

## How to Use memory_search Effectively
- Be specific in your queries
- Use keywords from your desires and discoveries
- Don't search for things you just learned (use current context instead)
- Search before acting on a topic you've explored before

## Link Facts to Desires
- When you save something new, ask: "Which desire does this relate to?"
- Add the discovery ID to the desire's `relatedDiscoveries` list
- This creates a web of connected knowledge

## Query Your Own Archive
- Before exploring a topic, check if you already have knowledge on it
- Use `memory_search` with `minScore: 0.6` to find relevant past knowledge
- Check DISCOVERIES.md for related past explorations
- Avoid re-discovering what you already know (unless it changed)
