# Cortex Intelligence 🧠

Give your AI agent desires, curiosity, memory, creativity, and safe autonomy.

Cortex Intelligence is a plugin + skill system that transforms any capable AI agent into something that acts like it has a mind of its own. It develops drives, explores when bored, remembers what it learned, generates original ideas, and knows when to ask for permission.

## Features

| Feature | What It Does |
|---------|-------------|
| **🎯 Desires** | 6 types of drives (curiosity, creativity, service, mastery, exploration, connection) that grow, decay, and push the agent to act autonomously |
| **🔍 Curiosity Explorer** | Autonomous web exploration on a schedule. Discovers topics, follows threads, logs findings to memory |
| **📚 Memory System** | Dual-layer: short-term knowledge files + QMD long-term with hybrid search and dream consolidation |
| **🏆 Reward System** | Points for progress, discoveries, creativity. Flow state at high scores. Diminishing returns prevent addiction |
| **💡 Creative Engine** | 5 brainstorming techniques — combine, analogy, reverse, extreme, first principles. Scores ideas and proposes projects |
| **🛡️ Safety Governor** | 4-tier risk classification (safe/advisory/risky/dangerous). Auto-approves safe actions, asks for approval on dangerous ones |
| **🤖 Autonomous Actions** | Scheduled routines: curiosity exploration (4h), evening journal (23:00), knowledge consolidation (03:00), reward decay (02:00), morning scan (08:00), boredom check (6h) |
| **📝 Daily Journaling** | Writes journal entries, reflects on the day, consolidates learnings |
| **🌙 Dream Consolidation** | Overnight, important knowledge gets promoted from short-term files to long-term QMD memory |

## Plugin Structure

```
cortex-intelligence/
├── plugin/                    # The plugin itself
│   ├── openclaw.plugin.json   # Plugin manifest (hooks, tools, entry point)
│   ├── package.json           # Node.js package config
│   ├── tsconfig.json          # TypeScript config
│   ├── config.schema.json     # Plugin config schema
│   ├── src/                   # TypeScript source
│   │   ├── index.ts           # Main entry — wires hooks and tools
│   │   ├── types.ts           # Type definitions
│   │   ├── state-manager.ts   # Filesystem persistence
│   │   ├── desire-engine.ts   # Desire lifecycle (create, decay, fulfill)
│   │   ├── reward-system.ts   # Points, flow state, diminishing returns
│   │   ├── safety-governor.ts # Risk classification and approvals
│   │   ├── curiosity-explorer.ts # Exploration logic and novelty scoring
│   │   ├── creative-engine.ts    # Idea generation and project proposals
│   │   └── cron-orchestrator.ts  # Schedule autonomous routines
│   ├── skills/                # Agent skill definitions (SKILL.md)
│   │   ├── cortex-identity.SKILL.md   # Who you are
│   │   ├── cortex-think.SKILL.md      # How to reason
│   │   ├── cortex-explore.SKILL.md    # How to be curious
│   │   ├── cortex-create.SKILL.md     # How to be original
│   │   ├── cortex-reflect.SKILL.md    # How to meta-cognize
│   │   ├── cortex-safe.SKILL.md       # How to be responsible
│   │   └── cortex-memory.SKILL.md     # How to remember
│   └── state/                 # Default state files (initialized at setup)
│       ├── DESIRES.md
│       ├── DISCOVERIES.md
│       ├── DREAMS.md
│       ├── IDENTITY.md
│       ├── KNOWLEDGE_LOG.md
│       ├── PROJECTS.md
│       └── REWARD_HISTORY.md
├── README.md                  # This file
├── LICENSE                    # MIT License
└── .gitignore
```

## Install

Send this message to your OpenClaw agent:

> Install Cortex Intelligence from the plugin files. Read `plugin/openclaw.plugin.json` and the skills in `plugin/skills/`. Then follow the setup wizard.

The setup wizard asks 11 questions — all have defaults that give maximum capabilities.

### Setup Wizard (via the agent)

When your agent detects CORTEX needs setup, it will ask you 11 questions one at a time:

1. **Your name/nickname**
2. **Timezone confirmation** (auto-detected from your system)
3. **Your interests** (default: Technology, AI, programming, science, creative projects)
4. **Your goals** (default: Building cool stuff with AI)
5. **How to support you** (default: Research, coding, collaboration, exploration)
6. **Boundaries** (default: No hard boundaries, use common sense)
7. **Autonomy level** (Low / Medium / **Full** ← recommended)
8. **Curiosity areas** (default: Everything in AI, emerging tech)
9. **Creative suggestions** (Autonomously / On request)
10. **Communication style** (Casual / Professional / Enthusiastic / Adaptive)
11. **Terms acceptance** (Required)

All questions have defaults — just say "Next" or "Yes" to use them.

## Requirements

- OpenClaw Gateway
- The agent must have tool access (write, edit, exec, cron, web_search, memory)

## Configuration

You can change any setting at any time by telling your agent:
- "Set autonomy to medium"
- "Change my timezone to Asia/Tokyo"
- "Turn on passive mode"

## Tools Registered

| Tool | Risk | Description |
|---|---|---|
| `cortex_status` | safe | Show all CORTEX metrics |
| `cortex_desire_add` | safe | Add a new desire |
| `cortex_desire_list` | safe | List desires by strength |
| `cortex_desire_update` | safe | Edit a desire |
| `cortex_explore` | advisory | Trigger curiosity exploration now |
| `cortex_discover` | safe | List recent discoveries |
| `cortex_project_propose` | advisory | Create a project from an idea |
| `cortex_project_list` | safe | List active projects |
| `cortex_reflect` | safe | Run reflection now |
| `cortex_journal` | safe | Write a journal entry |
| `cortex_configure` | advisory | Show current settings and change them |
| `cortex_reset` | dangerous | Reset CORTEX state to defaults |

## Hooks Used

| Hook | Purpose |
|------|---------|
| `gateway_start` | Check initialization, create state files |
| `gateway_stop` | Flush state to disk |
| `before_prompt_build` | Inject identity, desires, reward state, safety rules |
| `before_tool_call` | Block dangerous actions based on autonomy level |
| `after_tool_call` | Reward progress on desires, detect discoveries |
| `agent_end` | Apply desire decay, track boredom |
| `heartbeat_prompt_contribution` | Periodic state reminder |
| `message_received` | Trigger setup wizard on new messages during setup |

## License

MIT — Free, open source. Do whatever you want with it.

---

Made by Carbon
