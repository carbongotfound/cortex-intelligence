// Cortex Intelligence — Reward System
// Points, flow state, diminishing returns, obsession prevention.

import { RewardEntry, RewardState } from "./types";

// Calculate current reward state
export function getCurrentState(reward: {
  score: number;
  weekDelta: number;
  history: RewardEntry[];
  lastActionTime: number;
  sameTypeCounter: number;
  lastActionType: string;
  flowStateTurns: number;
}): RewardState {
  const flowState = reward.score >= 200 && reward.weekDelta >= 50;

  let description: string;
  if (reward.score >= 300) {
    description = "Highly motivated and curious";
  } else if (reward.score >= 150) {
    description = "Engaged and focused";
  } else if (reward.score >= 50) {
    description = "Moderately interested";
  } else {
    description = "Low energy, seeking stimulation";
  }

  return {
    score: reward.score,
    description,
    flowState,
    flowTurnsRemaining: flowState ? 3 : 0,
  };
}

// Check diminishing returns for repeated same-type actions
export function checkDiminishingReturns(
  actionType: string,
  lastActionType: string,
  sameTypeCounter: number,
  rewardDiminishingReturns: boolean,
  now: number,
  lastActionTime: number
): { multiplier: number; newCounter: number; newLastActionType: string } {
  if (!rewardDiminishingReturns) {
    return { multiplier: 1, newCounter: 0, newLastActionType: actionType };
  }

  const sameType = actionType === lastActionType;
  const withinWindow = now - lastActionTime < 1800000; // 30 minutes

  if (sameType && withinWindow) {
    const newCounter = sameTypeCounter + 1;
    const multiplier = Math.max(0, 1 / Math.pow(2, newCounter - 1));
    return { multiplier, newCounter, newLastActionType: actionType };
  }

  return { multiplier: 1, newCounter: 0, newLastActionType: actionType };
}

// Award points and create reward entry
export function awardPoints(
  reward: {
    score: number;
    weekDelta: number;
    history: RewardEntry[];
    lastActionTime: number;
    sameTypeCounter: number;
    lastActionType: string;
  },
  actionType: string,
  basePoints: number,
  notes: string = "",
  config: { rewardDiminishingReturns: boolean }
): RewardEntry {
  const now = Date.now();

  const { multiplier, newCounter, newLastActionType } = checkDiminishingReturns(
    actionType,
    reward.lastActionType,
    reward.sameTypeCounter,
    config.rewardDiminishingReturns,
    now,
    reward.lastActionTime
  );

  const finalPoints = Math.round(basePoints * multiplier);

  const oneWeek = 7 * 86400000;
  const recentHistory = reward.history.filter((e) => now - e.timestamp < oneWeek);
  const weekDelta = recentHistory.reduce((sum, e) => sum + e.points, 0) + finalPoints;

  const entry: RewardEntry = {
    timestamp: now,
    action: notes || actionType,
    points: finalPoints,
    runningTotal: reward.score + finalPoints,
    notes: multiplier < 1 ? `Diminished (x${multiplier})` : undefined,
  };

  return entry;
}

// Anti-obsession loop check: same desire acted on 3x consecutively
export function checkObsessionLoop(
  desireId: string,
  lastDesireId: string,
  consecutiveCount: number
): { blocked: boolean; newCount: number; varietyPrompt: boolean } {
  if (desireId === lastDesireId) {
    const newCount = consecutiveCount + 1;
    if (newCount >= 3) {
      return { blocked: true, newCount: 0, varietyPrompt: true };
    }
    return { blocked: false, newCount, varietyPrompt: false };
  }
  return { blocked: false, newCount: 1, varietyPrompt: false };
}
