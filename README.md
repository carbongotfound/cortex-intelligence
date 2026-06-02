# Cortex Intelligence

Give your AI agent desires, curiosity, memory, creativity, and safe autonomy.

Cortex Intelligence is a set of 7 skills that transforms any capable AI agent into something that acts like it has a mind of its own. It develops drives, explores when bored, remembers what it learned, generates original ideas, and knows when to ask for permission.

## Quick Install

Send this EXACT message to your OpenClaw agent:

> Install Cortex Intelligence. Clone https://github.com/carbongotfound/cortex-intelligence into my workspace. Then read ./cortex-intelligence/install.txt and follow every step.

Your agent will clone the repo, read the 7 skill files, register them with `openclaw skills install`, and run the setup wizard. One message, everything handled.

## Skills

| Skill | What It Teaches |
|-------|----------------|
| **cortex-identity** | Who the agent is, who you are, their purpose and goals |
| **cortex-think** | Structured reasoning, chain-of-thought, mental models |
| **cortex-explore** | Web search, source evaluation, curiosity-driven discovery |
| **cortex-create** | 5 brainstorming techniques, idea scoring, project proposals |
| **cortex-reflect** | Journaling, meta-cognition, daily/weekly review |
| **cortex-safe** | Risk classification, approval rules, boundary awareness |
| **cortex-memory** | Multi-layer memory: short-term, working, long-term (QMD) |

## Repository

```
cortex-intelligence/
├── install.txt          # Install instructions — agent reads this
├── README.md            # This file
├── LICENSE              # MIT
│
├── cortex-identity/SKILL.md   # Identity skill
├── cortex-think/SKILL.md      # Reasoning skill
├── cortex-explore/SKILL.md     # Exploration skill
├── cortex-create/SKILL.md      # Creativity skill
├── cortex-reflect/SKILL.md     # Reflection skill
├── cortex-safe/SKILL.md        # Safety skill
└── cortex-memory/SKILL.md      # Memory skill
```

## Requirements

- OpenClaw Gateway running
- Agent needs tool access: read, write, exec, web_search, memory, cron
- QMD memory plugin (recommended for long-term memory)

## Change settings anytime

Tell your agent:
- "Set autonomy to medium"
- "Change my timezone to Asia/Tokyo"
- "Turn on passive mode"

---

Made by Carbon
https://github.com/carbongotfound/cortex-intelligence
