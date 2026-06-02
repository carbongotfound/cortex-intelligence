// Cortex Intelligence — Safety Governor
// Risk classification, approval handling, action description.

import { RiskLevel, AutonomyLevel } from "./types";

// Risk classification for tools and actions
const TOOL_RISK_MAP: Record<string, RiskLevel> = {
  // Cortex internal tools — always safe
  cortex_status: "safe",
  cortex_desire_add: "safe",
  cortex_desire_list: "safe",
  cortex_desire_update: "safe",
  cortex_discover: "safe",
  cortex_project_list: "safe",
  cortex_reflect: "safe",
  cortex_journal: "safe",

  // Cortex advisory tools
  cortex_explore: "advisory",
  cortex_project_propose: "advisory",
  cortex_configure: "advisory",

  // Cortex dangerous tools
  cortex_reset: "dangerous",

  // Read operations — safe
  web_search: "safe",
  web_fetch: "safe",
  memory_search: "safe",
  memory_get: "safe",
  memory_recall: "safe",
  session_status: "safe",
  sessions_list: "safe",
  sessions_history: "safe",
  sessions_send: "safe",
  subagents: "safe",

  // Advisory
  sessions_spawn: "advisory",

  // Risky — modifies files or schedules
  write: "risky",
  edit: "risky",
  cron: "risky",

  // Dangerous — system-level access
  exec: "dangerous",
  image: "advisory",
  gateway: "dangerous",
};

// Pattern-based risk classification for unknown tools
function classifyByPattern(toolName: string): RiskLevel {
  const name = toolName.toLowerCase();

  if (name.includes("read") || name.includes("list") || name.includes("get") || name.includes("search") || name.includes("status")) {
    return "safe";
  }

  if (name.includes("write") || name.includes("edit") || name.includes("update") || name.includes("set") || name.includes("add") || name.includes("create")) {
    return "advisory";
  }

  if (name.includes("delete") || name.includes("remove") || name.includes("kill") || name.includes("stop") || name.includes("restart")) {
    return "risky";
  }

  if (name.includes("exec") || name.includes("shell") || name.includes("bash") || name.includes("install") || name.includes("sudo") || name.includes("chmod") || name.includes("chown")) {
    return "dangerous";
  }

  return "advisory";
}

// Classify a tool call's risk level
export function classifyRisk(toolName: string): RiskLevel {
  return TOOL_RISK_MAP[toolName] || classifyByPattern(toolName);
}

// Determine if approval is needed
export function needsApproval(risk: RiskLevel, autonomyLevel: AutonomyLevel, requireApprovalFor: RiskLevel[]): boolean {
  if (requireApprovalFor.includes(risk)) {
    return true;
  }

  switch (autonomyLevel) {
    case "low":
      return risk !== "safe";
    case "medium":
      return risk === "risky" || risk === "dangerous";
    case "full":
      return risk === "dangerous";
    default:
      return true;
  }
}

// Get approval config for a risk level
export function getApprovalConfig(risk: RiskLevel): {
  severity: "info" | "warning" | "critical";
  title: string;
  timeoutMs: number;
  timeoutBehavior: "allow" | "deny";
  allowedDecisions?: string[];
} {
  switch (risk) {
    case "advisory":
      return {
        severity: "info",
        title: "Advisory: Cortex is about to act",
        timeoutMs: 60000,
        timeoutBehavior: "allow",
      };
    case "risky":
      return {
        severity: "warning",
        title: "Risky action needs approval",
        timeoutMs: 120000,
        timeoutBehavior: "deny",
        allowedDecisions: ["allow-once", "deny"],
      };
    case "dangerous":
      return {
        severity: "critical",
        title: "Dangerous action blocked — confirm twice",
        timeoutMs: 180000,
        timeoutBehavior: "deny",
        allowedDecisions: ["allow-once", "deny"],
      };
    default:
      return {
        severity: "info",
        title: "Action requires approval",
        timeoutMs: 60000,
        timeoutBehavior: "deny",
      };
  }
}

// Describe an action for the approval prompt
export function describeAction(toolName: string, params: Record<string, unknown>): string {
  const lines: string[] = [`Tool: ${toolName}`];

  if (params.command) lines.push(`Command: \`${String(params.command).substring(0, 200)}\``);
  if (params.path) lines.push(`Path: \`${String(params.path)}\``);
  if (params.url) lines.push(`URL: \`${String(params.url)}\``);
  if (params.content) {
    const content = String(params.content);
    lines.push(`Content: ${content.substring(0, 100)}${content.length > 100 ? "..." : ""}`);
  }
  if (params.toolName) lines.push(`Target tool: ${String(params.toolName)}`);

  return lines.join("\n");
}
