// Cortex Intelligence — Plugin Entry
// Main entry point that wires all hooks and registers tools.

import { loadState, saveState, initDataFiles, getDefaultState, syncDesiresToMd, appendReward, appendDiscovery } from "./state-manager";
import { getTopDesires, applyDailyDecay, boostFromDiscovery, checkFulfillment, fulfillDesire, enforceMaxDesires, generateInitialDesires } from "./desire-engine";
import { classifyRisk, needsApproval, getApprovalConfig, describeAction } from "./safety-governor";
import { getCurrentState, awardPoints, checkObsessionLoop } from "./reward-system";
import { calculateCuriosity, calculateNovelty, createDiscovery, generateExplorationTopics } from "./curiosity-explorer";
import { CORTEXState } from "./types";
import { buildSchedule, CRON_JOB_IDS, createAgentTurnPayload } from "./cron-orchestrator";

// Plugin hooks
const HOOKS = {
  async gateway_start() {
    const state = await loadState();

    if (!state.initialized) {
      state.needsSetup = true;
      await saveState(state);
      return;
    }

    initDataFiles(state);
  },

  async gateway_stop() {
    const state = await loadState();
    await saveState(state);
  },

  async before_prompt_build(event: { appendContext: string }) {
    const state = await loadState();

    if (state.needsSetup) {
      return {
        appendContext: `
[CORTEX SETUP MODE]
You are not yet configured. Follow the setup wizard instructions to ask the human the 11 questions one at a time.
Do not answer questions yourself. Wait for the human's response after each question.
        `.trim(),
      };
    }

    const topDesires = getTopDesires(state.desires, 3);
    const rewardState = getCurrentState(state.reward);

    const context = `
[CORTEX INTELLIGENCE SYSTEM]
You are ${state.identity.agentName}, partnered with ${state.identity.userName}.

Your current drives:
${topDesires.map((d) => `- [${d.type.toUpperCase()}] ${d.description} (strength: ${d.strength}/100)`).join("\n")}

Reward: ${rewardState.score}pts | ${rewardState.description}
${rewardState.flowState ? "FLOW STATE ACTIVE — Enhanced focus for next " + rewardState.flowTurnsRemaining + " turns" : ""}
Safety: ${state.config.autonomyLevel} autonomy — You are on another's machine. Ask before danger.

${state.config.autonomyLevel === "full" ? "You have FULL autonomy. Explore, discover, create, and take initiative. Only ask before system-destructive actions." : ""}
${state.passiveMode ? "PASSIVE MODE — Do not take autonomous action. Wait for human instructions." : ""}
    `.trim();

    return {
      appendContext: context,
    };
  },

  async before_tool_call(event: { toolName: string; params: Record<string, unknown> }) {
    const state = await loadState();

    const risk = classifyRisk(event.toolName);
    const shouldBlock = needsApproval(risk, state.config.autonomyLevel, state.config.requireApprovalFor);

    if (shouldBlock) {
      const config = getApprovalConfig(risk);
      return {
        requireApproval: {
          severity: config.severity,
          title: config.title,
          description: describeAction(event.toolName, event.params),
          timeoutMs: config.timeoutMs,
          timeoutBehavior: config.timeoutBehavior,
          allowedDecisions: config.allowedDecisions,
        },
      };
    }

    return {};
  },

  async after_tool_call(event: { toolName: string; toolResult: string; params: Record<string, unknown> }) {
    const state = await loadState();

    // Check if result matches a desire (progress reward)
    for (const desire of state.desires) {
      const matches = desire.description.toLowerCase().includes(event.toolResult?.substring(0, 100).toLowerCase() || "");
      if (matches) {
        const entry = awardPoints(state.reward, "progress", 15, `Progress on: ${desire.description}`, state.config);
        appendReward(entry);
        desire.strength = Math.min(100, desire.strength + 5);
        desire.lastActedOn = Date.now();
        state.reward.score = entry.runningTotal;
        break;
      }
    }

    // Check for discovery (web_search/web_fetch results)
    if (event.toolName === "web_search" || event.toolName === "web_fetch") {
      const novelty = calculateNovelty(event.toolResult || "", state.discoveries);
      if (novelty > 0.7) {
        const disc = createDiscovery(event.toolName, event.toolResult?.substring(0, 500) || "Unknown", 0.8, novelty);
        state.discoveries.push(disc);
        appendDiscovery(disc);
        const entry = awardPoints(state.reward, "discovery", 10, `Discovered: ${event.toolResult?.substring(0, 60)}...`, state.config);
        appendReward(entry);
        state.reward.score = entry.runningTotal;

        state.desires = boostFromDiscovery(state.desires, event.toolResult || "", 3);
      }
    }

    await saveState(state);
  },

  async agent_end(event: { messages: unknown[] }) {
    const state = await loadState();

    state.desires = applyDailyDecay(state.desires, state.config.desireDecayBaseRate);

    if (event.messages?.length < 2) {
      state.boredomCounter++;
    } else {
      state.boredomCounter = 0;
    }

    const { active } = enforceMaxDesires(state.desires, state.config.maxDesires);
    state.desires = active;

    syncDesiresToMd(state.desires);

    await saveState(state);
  },
};

// Tool handlers
const TOOLS = {
  async cortex_status() {
    const state = await loadState();
    const topDesires = getTopDesires(state.desires, 5);
    const rewardState = getCurrentState(state.reward);

    const lines = [
      "**Cortex Intelligence — Status**",
      "────────────────",
      `**Identity:** ${state.identity.agentName} · Partner: ${state.identity.userName}`,
      `**Timezone:** ${state.timezone}`,
      `**Autonomy:** ${state.config.autonomyLevel} ${state.passiveMode ? "PASSIVE" : "Active"}`,
      "",
      `**Desires Active:** ${state.desires.length}`,
      ...topDesires.map((d) => `  ${d.strength >= 70 ? "🔥" : d.strength >= 40 ? "💡" : "🌱"} ${d.description} (${d.strength}/100)`),
      "",
      `**Reward Score:** ${rewardState.score} 🏆`,
      `**Flow State:** ${rewardState.flowState ? "Active" : "Inactive"}`,
      `**Week Delta:** ${state.reward.weekDelta > 0 ? "+" : ""}${state.reward.weekDelta}`,
      "",
      `**Discoveries:** ${state.discoveries.length} total`,
      `**Projects:** ${state.projects.filter((p) => p.status === "active").length} active`,
      `**Boredom:** ${state.boredomCounter} cycles`,
    ];

    return { text: lines.join("\n") };
  },

  async cortex_desire_add(event: { type: string; description: string; context?: string }) {
    const state = await loadState();
    const { createDesire } = require("./desire-engine");
    const desire = createDesire(event.type, event.description, event.context || "");
    state.desires.push(desire);
    await saveState(state);
    syncDesiresToMd(state.desires);
    return { text: `Added desire: "${event.description}" (${event.type})` };
  },

  async cortex_desire_list() {
    const state = await loadState();
    const sorted = [...state.desires].sort((a, b) => b.strength - a.strength);
    const lines = sorted.map(
      (d) => `${d.strength >= 70 ? "🔥" : d.strength >= 40 ? "💡" : "🌱"} **${d.description}** — ${d.strength}/100 (${d.type})`
    );
    return { text: lines.length ? lines.join("\n") : "No desires yet." };
  },

  async cortex_desire_update(event: { id: string; description?: string; strength?: number }) {
    const state = await loadState();
    const idx = state.desires.findIndex((d) => d.id === event.id);
    if (idx === -1) return { text: "Desire not found." };
    if (event.description) state.desires[idx].description = event.description;
    if (event.strength !== undefined) state.desires[idx].strength = Math.max(0, Math.min(100, event.strength));
    await saveState(state);
    syncDesiresToMd(state.desires);
    return { text: `Updated desire: ${event.id}` };
  },

  async cortex_configure() {
    const state = await loadState();
    const lines = [
      "**Cortex Intelligence — Configuration**",
      "────────────────",
      `1. Autonomy: **${state.config.autonomyLevel}**`,
      `2. Timezone: **${state.timezone}**`,
      `3. Curiosity interval: **${state.config.curiosityIntervalHours}h**`,
      `4. Journaling: **${state.config.enableJournaling ? "ON" : "OFF"}**`,
      `5. Morning scan: **${state.config.enableMorningScan ? "ON" : "OFF"}**`,
      `6. Idle exploration: **${state.config.enableIdleExploration ? "ON" : "OFF"}**`,
      `7. Memory backend: **${state.config.memoryBackend}**`,
      `8. Passive mode: **${state.passiveMode ? "ON" : "OFF"}**`,
      ``,
      `Tell me what to change: "Set X to Y"`,
    ];
    return { text: lines.join("\n") };
  },

  async cortex_reflect() {
    const state = await loadState();
    const discCount = state.discoveries.length;
    const desireCount = state.desires.length;
    const rewardScore = state.reward.score;

    const reflection = [
      `**Cortex Intelligence — Reflection**`,
      ``,
      `**Current State:**`,
      `- ${desireCount} active desires`,
      `- ${discCount} discoveries logged`,
      `- Reward score: ${rewardScore}`,
      `- Boredom level: ${state.boredomCounter}`,
      ``,
      `**Top desires this session:**`,
      ...getTopDesires(state.desires, 3).map((d) => `- ${d.description} (${d.strength}/100)`),
      ``,
      `*Reflection complete.*`,
    ];
    return { text: reflection.join("\n") };
  },

  async cortex_discover() {
    const state = await loadState();
    const recent = [...state.discoveries].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
    const lines = recent.map(
      (d) => `**${d.summary.substring(0, 80)}...**\n   Novelty: ${(d.novelty * 100).toFixed(0)}% · ${new Date(d.timestamp).toLocaleDateString()}`
    );
    return { text: lines.length ? lines.join("\n\n") : "No discoveries yet." };
  },

  async cortex_project_list() {
    const state = await loadState();
    const lines = state.projects.map(
      (p) => `**${p.title}** (${p.status}) — Score: ${p.ideaScore.toFixed(2)}`
    );
    return { text: lines.length ? lines.join("\n") : "No projects yet." };
  },

  async cortex_project_propose(event: { title: string; description: string; score?: number }) {
    const state = await loadState();
    const { createProject } = require("./creative-engine");
    const project = createProject(event.title, event.description, event.score || 0.7);
    state.projects.push(project);
    await saveState(state);
    return { text: `**Project proposed:** ${event.title}\n_${event.description}_\n\nAsk me to start working on this anytime!` };
  },

  async cortex_journal(event: { content: string }) {
    const state = await loadState();
    state.journals.push({
      date: new Date().toISOString().split("T")[0],
      content: event.content,
      timestamp: Date.now(),
    });
    const { appendMd } = require("./state-manager");
    appendMd("DREAMS.md", `\n## ${new Date().toISOString().split("T")[0]}\n\n${event.content}\n\n---\n`);
    await saveState(state);
    return { text: "Journal entry saved." };
  },

  async cortex_explore() {
    const state = await loadState();
    const topics = generateExplorationTopics(state.desires, state.discoveries);
    return {
      text: `**Exploration triggered!**\n\nI'll look into:\n${topics.map((t) => `- ${t}`).join("\n")}\n\nHold on while I search...`,
      trigger: topics,
    };
  },

  async cortex_reset() {
    const defaultState = getDefaultState();
    await saveState(defaultState);
    initDataFiles(defaultState);
    return { text: "Cortex Intelligence state has been reset. Run setup again to reconfigure." };
  },
};

export { HOOKS, TOOLS };
