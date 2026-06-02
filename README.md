# Cortex Intelligence

A plugin + skill system for agents running on the [OpenClaw](https://openclaw.ai) platform. Gives your AI agent desires, curiosity, memory, creativity, rewards, and a safety governor.

```
cortex-intelligence/
├── install.txt          # Copy-paste install message for your agent
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

## Quick Install

Copy and paste this EXACT message to your OpenClaw agent:

> Install Cortex Intelligence.
>
> Clone https://github.com/carbongotfound/cortex-intelligence into my workspace.
>
> The plugin is at `cortex-intelligence/plugin/`.
> The entry point is `cortex-intelligence/plugin/openclaw.plugin.json`.
> The source code is in `cortex-intelligence/plugin/src/`.
> The skills are in `cortex-intelligence/plugin/skills/`.
>
> Read all the source files, compile with `npm install && npx tsc` in the plugin directory, then run the setup wizard.

Your agent will:
1. Clone the repo to your workspace
2. Read all the plugin source files and skills
3. Compile the TypeScript to JavaScript
4. Ask you 11 setup questions (all have defaults)
5. Start running with full autonomy

## Features

| Feature | What It Does |
|---------|-------------|
| **Desire Engine** | 6 types of drives that grow, decay, and push the agent to act |
| **Curiosity Explorer** | Autonomous web exploration on a schedule |
| **Memory System** | Dual-layer: short-term knowledge files + QMD long-term |
| **Reward System** | Points, flow state, diminishing returns |
| **Creative Engine** | 5 brainstorming techniques, scores ideas, proposes projects |
| **Safety Governor** | 4-tier risk classification with approval matrix |
| **Daily Routines** | Morning scan, evening journal, nightly consolidation |
| **Setup Wizard** | 11 questions, defaults give max capabilities |

## Requirements

- OpenClaw Gateway running
- QMD memory plugin (recommended) or built-in memory
- Agent must have tool access: write, edit, exec, cron, web_search, memory

## Changing Settings

Tell your agent:
- "Set autonomy to medium"
- "Change my timezone to Asia/Tokyo"
- "Turn on passive mode"

## License

MIT — Free, open source, do whatever you want with it.

---

Made by Carbon
https://github.com/carbongotfound/cortex-intelligence
