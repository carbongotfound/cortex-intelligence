// Cortex Intelligence — Cron Orchestrator
// Schedule and manage cron jobs for autonomous routines.

export interface CronSchedule {
  exploration: { everyMs: number };
  journal: { kind: "cron"; expr: string; tz: string };
  consolidate: { kind: "cron"; expr: string; tz: string };
  rewardDecay: { kind: "cron"; expr: string; tz: string };
  morningScan: { kind: "cron"; expr: string; tz: string };
  boredom: { everyMs: number };
}

// Build cron schedule from config and timezone
export function buildSchedule(config: {
  curiosityIntervalHours: number;
  journalTime: string;
  consolidationTime: string;
  morningScanTime: string;
}): CronSchedule {
  return {
    exploration: { everyMs: config.curiosityIntervalHours * 3600000 },
    journal: { kind: "cron", expr: `0 ${config.journalTime.split(":")[1] || "0"} ${config.journalTime.split(":")[0] || "23"} * * *`, tz: "auto" },
    consolidate: { kind: "cron", expr: `0 ${config.consolidationTime.split(":")[1] || "0"} ${config.consolidationTime.split(":")[0] || "3"} * * *`, tz: "auto" },
    rewardDecay: { kind: "cron", expr: "0 0 2 * * *", tz: "auto" },
    morningScan: { kind: "cron", expr: `0 ${config.morningScanTime.split(":")[1] || "0"} ${config.morningScanTime.split(":")[0] || "8"} * * *`, tz: "auto" },
    boredom: { everyMs: 21600000 },
  };
}

// Cron job IDs for management
export const CRON_JOB_IDS = {
  exploration: "cortex-curiosity-exploration",
  journal: "cortex-evening-journal",
  consolidate: "cortex-knowledge-consolidation",
  rewardDecay: "cortex-reward-decay",
  morningScan: "cortex-morning-scan",
  boredom: "cortex-boredom-check",
};

// Create agent turn payload for a cron job
export function createAgentTurnPayload(message: string): { kind: string; message: string } {
  return {
    kind: "agentTurn",
    message,
  };
}

// Create system event payload for a cron job
export function createSystemEventPayload(text: string): { kind: string; text: string } {
  return {
    kind: "systemEvent",
    text,
  };
}
