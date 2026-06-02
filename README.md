# Cortex Intelligence

Give your AI agent desires, curiosity, memory, creativity, and safe autonomy.

Cortex Intelligence is a plugin + skill system that transforms any capable AI agent into something that acts like it has a mind of its own. It develops drives, explores when bored, remembers what it learned, generates original ideas, and knows when to ask for permission.

## Quick Install

Copy this message and send it to your OpenClaw agent:

> Install Cortex Intelligence. Read the file at https://raw.githubusercontent.com/carbongotfound/cortex-intelligence/main/install.txt and follow every step.

The install.txt file tells the agent exactly what to do — clone, read files, compile, register with OpenClaw, run the setup wizard, and set up cron jobs. Zero effort from you.

## Repository structure

```
cortex-intelligence/
├── install.txt          # Install instructions (the agent reads this)
├── README.md            # This file
├── LICENSE              # MIT
│
├── plugin/
│   ├── openclaw.plugin.json   # Manifest — hooks, tools, entry point
│   ├── package.json           # Node dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── config.schema.json     # Config validation schema
│   ├── src/                   # TypeScript source code
│   │   ├── index.ts                 # Entry — wires hooks + tools
│   │   ├── types.ts                 # Type definitions
│   │   ├── state-manager.ts         # Read/write state
│   │   ├── desire-engine.ts         # Desire creation, decay, fulfillment
│   │   ├── reward-system.ts         # Points, flow state, diminishing returns
│   │   ├── safety-governor.ts       # Risk classification, approval flow
│   │   ├── curiosity-explorer.ts    # Exploration algorithm
│   │   ├── creative-engine.ts       # Idea generation
│   │   └── cron-orchestrator.ts     # Schedule builder
│   ├── skills/                # 7 skill files that teach behavior
│   │   ├── cortex-identity.SKILL.md
│   │   ├── cortex-think.SKILL.md
│   │   ├── cortex-explore.SKILL.md
│   │   ├── cortex-create.SKILL.md
│   │   ├── cortex-reflect.SKILL.md
│   │   ├── cortex-safe.SKILL.md
│   │   └── cortex-memory.SKILL.md
│   └── state/                 # Default state files (generated on init)
│       ├── DESIRES.md
│       ├── DISCOVERIES.md
│       ├── DREAMS.md
│       ├── IDENTITY.md
│       ├── KNOWLEDGE_LOG.md
│       ├── PROJECTS.md
│       └── REWARD_HISTORY.md
```

## Features

| Feature | What It Does |
|---------|-------------|
| Desire Engine | 6 types of drives that grow, decay, and push the agent to act |
| Curiosity Explorer | Autonomous web exploration on a schedule |
| Memory System | Short-term knowledge files + QMD long-term memory |
| Reward System | Points, flow state, diminishing returns, obsession prevention |
| Creative Engine | 5 brainstorming techniques, scores ideas, proposes projects |
| Safety Governor | 4-tier risk classification with approval matrix |
| Daily Routines | Morning scan, evening journal, nightly consolidation |
| Setup Wizard | 11 questions, defaults give max capabilities |

## Requirements

- OpenClaw Gateway running
- QMD memory plugin (recommended)
- Agent needs tool access: read, write, edit, exec, cron, web_search, memory

## Change settings anytime

Tell your agent:
- "Set autonomy to medium"
- "Change my timezone to Asia/Tokyo"
- "Turn on passive mode"

---

Made by Carbon
https://github.com/carbongotfound/cortex-intelligence
