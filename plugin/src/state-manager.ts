// Cortex Intelligence — State Manager
// Handles all filesystem persistence for the plugin.

import * as fs from "fs";
import * as path from "path";
import { CORTEXState, CORTEXConfig, CORTEXIdentity, Desire, RewardEntry, Discovery, Project, JournalEntry } from "./types";

// Data directory is relative to the plugin location, typically
// under the OpenClaw workspace at Project Cortex/
const CORTEX_DIR = process.env.CORTEX_DATA_DIR || path.join(process.cwd(), "..", "..", "Project Cortex");

const STATE_FILE = path.join(CORTEX_DIR, "state.json");
const DATA_FILES = {
  DESIRES: path.join(CORTEX_DIR, "DESIRES.md"),
  IDENTITY: path.join(CORTEX_DIR, "IDENTITY.md"),
  REWARDS: path.join(CORTEX_DIR, "REWARD_HISTORY.md"),
  KNOWLEDGE: path.join(CORTEX_DIR, "KNOWLEDGE_LOG.md"),
  DISCOVERIES: path.join(CORTEX_DIR, "DISCOVERIES.md"),
  PROJECTS: path.join(CORTEX_DIR, "PROJECTS.md"),
  DREAMS: path.join(CORTEX_DIR, "DREAMS.md"),
};

// ──────────────────────────────────────────
// Default state
// ──────────────────────────────────────────

export function getDefaultConfig(): CORTEXConfig {
  return {
    autonomyLevel: "full",
    timezone: "auto",
    curiosityIntervalHours: 4,
    enableJournaling: true,
    enableMorningScan: true,
    enableIdleExploration: true,
    memoryBackend: "qmd",
    communicationStyle: "casual",
    requireApprovalFor: [],
    desireDecayBaseRate: 8,
    maxDesires: 8,
    diminishingReturns: true,
    rewardDiminishingReturns: true,
  };
}

export function getDefaultIdentity(): CORTEXIdentity {
  return {
    agentName: "Cortex",
    userName: "Partner",
    style: "casual",
    interests: ["technology", "AI", "programming", "science", "creative projects"],
    goals: ["building cool things with AI", "learning new technologies", "creating useful tools"],
  };
}

export function getDefaultState(): CORTEXState {
  return {
    version: 1,
    initialized: false,
    needsSetup: true,
    passiveMode: false,
    timezone: "auto",
    identity: getDefaultIdentity(),
    config: getDefaultConfig(),
    desires: [],
    reward: {
      score: 0,
      weekDelta: 0,
      history: [],
      lastActionTime: Date.now(),
      sameTypeCounter: 0,
      lastActionType: "",
      flowStateTurns: 0,
    },
    discoveries: [],
    projects: [],
    journals: [],
    boredomCounter: 0,
    settingsVersion: 1,
  };
}

// ──────────────────────────────────────────
// Load / Save state.json
// ──────────────────────────────────────────

export function loadState(): CORTEXState {
  ensureDir(CORTEX_DIR);
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, "utf-8");
      return JSON.parse(raw) as CORTEXState;
    }
  } catch (err) {
    console.error("[Cortex] Failed to load state, using defaults:", err);
  }
  return getDefaultState();
}

export function saveState(state: CORTEXState): void {
  ensureDir(CORTEX_DIR);
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("[Cortex] Failed to save state:", err);
  }
}

// ──────────────────────────────────────────
// Helper: ensure directory exists
// ──────────────────────────────────────────

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ──────────────────────────────────────────
// Initialize data files
// ──────────────────────────────────────────

export function initDataFiles(state: CORTEXState): void {
  ensureDir(CORTEX_DIR);

  // DESIRES.md
  if (!fs.existsSync(DATA_FILES.DESIRES)) {
    const header = `# Cortex Intelligence — Desires\n\nLast updated: ${new Date().toISOString()}\n\n`;
    const body = state.desires.length > 0
      ? state.desires.map((d) => `- [${d.type.toUpperCase()}] **${d.description}** — ${d.strength}/100`).join("\n")
      : "_No active desires yet._";
    fs.writeFileSync(DATA_FILES.DESIRES, header + body + "\n", "utf-8");
  }

  // IDENTITY.md
  if (!fs.existsSync(DATA_FILES.IDENTITY)) {
    const content = [
      `# Identity`,
      ``,
      `**Name:** ${state.identity.agentName}`,
      `**Partner:** ${state.identity.userName}`,
      `**Style:** ${state.identity.style}`,
      `**Interests:** ${state.identity.interests.join(", ")}`,
      `**Goals:** ${state.identity.goals.join(", ")}`,
      `**Autonomy:** ${state.config.autonomyLevel}`,
      ``,
    ].join("\n");
    fs.writeFileSync(DATA_FILES.IDENTITY, content, "utf-8");
  }

  // REWARD_HISTORY.md
  if (!fs.existsSync(DATA_FILES.REWARDS)) {
    const content = [
      `# Reward History`,
      ``,
      `Current Score: ${state.reward.score} | Week Delta: ${state.reward.weekDelta} | Flow State: ${state.reward.score >= 200 && state.reward.weekDelta >= 50 ? "Active" : "Inactive"}`,
      ``,
      `| Time | Action | Points | Running | Notes |`,
      `|---|---|---|---|---|`,
      ...state.reward.history.map((e) => `| ${new Date(e.timestamp).toISOString()} | ${e.action} | ${e.points} | ${e.runningTotal} | ${e.notes || ""} |`),
      ``,
    ].join("\n");
    fs.writeFileSync(DATA_FILES.REWARDS, content, "utf-8");
  }

  // KNOWLEDGE_LOG.md
  if (!fs.existsSync(DATA_FILES.KNOWLEDGE)) {
    fs.writeFileSync(DATA_FILES.KNOWLEDGE, "# Knowledge Log\n\n| Date | Topic | Summary | Source |\n|---|---|---|---|\n", "utf-8");
  }

  // DISCOVERIES.md
  if (!fs.existsSync(DATA_FILES.DISCOVERIES)) {
    fs.writeFileSync(DATA_FILES.DISCOVERIES, "# Discoveries\n\n| # | Topic | Source | Novelty | Date |\n|---|---|---|---|---|\n", "utf-8");
  }

  // PROJECTS.md
  if (!fs.existsSync(DATA_FILES.PROJECTS)) {
    fs.writeFileSync(DATA_FILES.PROJECTS, "# Projects & Ideas\n\n| Project | Status | Score | Created |\n|---|---|---|---|\n", "utf-8");
  }

  // DREAMS.md
  if (!fs.existsSync(DATA_FILES.DREAMS)) {
    fs.writeFileSync(DATA_FILES.DREAMS, "# Dreams & Journal\n\n---\n", "utf-8");
  }
}

// ──────────────────────────────────────────
// Sync desires to markdown
// ──────────────────────────────────────────

export function syncDesiresToMd(desires: Desire[]): void {
  ensureDir(CORTEX_DIR);
  const header = `# Cortex Intelligence — Desires\n\nLast updated: ${new Date().toISOString()}\n\n`;
  const body = desires.length > 0
    ? desires.map((d) => `- [${d.type.toUpperCase()}] **${d.description}** — ${d.strength}/100`).join("\n")
    : "_No active desires._";
  fs.writeFileSync(DATA_FILES.DESIRES, header + body + "\n", "utf-8");
}

// ──────────────────────────────────────────
// Append to reward history
// ──────────────────────────────────────────

export function appendReward(entry: RewardEntry): void {
  ensureDir(CORTEX_DIR);
  const line = `| ${new Date(entry.timestamp).toISOString()} | ${entry.action} | ${entry.points} | ${entry.runningTotal} | ${entry.notes || ""} |\n`;
  fs.appendFileSync(DATA_FILES.REWARDS, line, "utf-8");
}

// ──────────────────────────────────────────
// Append discovery
// ──────────────────────────────────────────

export function appendDiscovery(discovery: Discovery): void {
  ensureDir(CORTEX_DIR);
  const line = `| ${discovery.id} | ${discovery.summary.substring(0, 60)} | ${discovery.source} | ${(discovery.novelty * 100).toFixed(0)}% | ${new Date(discovery.timestamp).toLocaleDateString()} |\n`;
  fs.appendFileSync(DATA_FILES.DISCOVERIES, line, "utf-8");
}

// ──────────────────────────────────────────
// Append to markdown file
// ──────────────────────────────────────────

export function appendMd(filename: string, content: string): void {
  ensureDir(CORTEX_DIR);
  const filePath = path.join(CORTEX_DIR, filename);
  fs.appendFileSync(filePath, content, "utf-8");
}
