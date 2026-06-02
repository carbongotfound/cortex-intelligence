# Cortex Intelligence

A plugin + skill system for agents on [OpenClaw](https://openclaw.ai). Gives your AI agent desires, curiosity, memory, creativity, rewards, and safe autonomy.

## Quick Install

Copy this EXACT message and send it to your OpenClaw agent:

```
Install Cortex Intelligence.

Step 1: Clone the repo into my workspace.
Run: git clone https://github.com/carbongotfound/cortex-intelligence.git

Step 2: Go into the folder.
cd cortex-intelligence

Step 3: Find the plugin folder.
It's at: ./plugin/
The entry point is: ./plugin/openclaw.plugin.json
All source code is in: ./plugin/src/
All skill files are in: ./plugin/skills/

Step 4: Read every file.
Read ./plugin/openclaw.plugin.json
Read every .ts file in ./plugin/src/
Read every .SKILL.md file in ./plugin/skills/
Read ./plugin/package.json

Step 5: Install dependencies and compile.
cd ./plugin
Run: npm install
Run: npx tsc
This creates dist/index.js from the TypeScript source.

Step 6: Register the plugin with OpenClaw.
Read the OpenClaw config file at ~/.openclaw/openclaw.json
Add the path to the plugin folder to the "plugins" > "load" > "paths" array.
The path should be: the full absolute path of the plugin folder
(example: /home/user/cortex-intelligence/plugin)

Step 7: Tell me you're done.
Say: "Cortex Intelligence is installed. I need to run the setup wizard — 11 questions, all have defaults."

Step 8: Run the wizard.
Ask me 11 questions one at a time. Wait for my answer after each one.
All questions have defaults — if I say "yes" or "next" or "I don't know", use the default.

Step 9: After the wizard, register 6 cron jobs for routines.
Register these cron jobs:
  - exploration (every 4 hours)
  - evening journal (daily at 23:00 in my timezone)
  - knowledge consolidation (daily at 03:00)
  - reward decay (daily at 02:00)
  - morning scan (daily at 08:00)
  - boredom check (every 6 hours)

Step 10: Done. Start helping me.
```

Your agent follows steps 1 through 10 in order. One message, everything included.

## Repository structure

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
