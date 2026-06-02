// Cortex Intelligence — Type Definitions

export type RiskLevel = "safe" | "advisory" | "risky" | "dangerous";
export type AutonomyLevel = "low" | "medium" | "full";
export type DesireType = "curiosity" | "creativity" | "service" | "mastery" | "exploration" | "connection";
export type ProjectStatus = "proposed" | "active" | "paused" | "completed" | "abandoned";

export interface Desire {
  id: string;
  type: DesireType;
  description: string;
  context: string;
  strength: number; // 0-100
  createdAt: number;
  lastActedOn: number;
  fulfillmentCount: number;
  relatedDiscoveries: string[];
}

export interface RewardEntry {
  timestamp: number;
  action: string;
  points: number;
  runningTotal: number;
  notes?: string;
}

export interface RewardState {
  score: number;
  description: string;
  flowState: boolean;
  flowTurnsRemaining: number;
}

export interface Discovery {
  id: string;
  source: string;
  summary: string;
  relevance: number;
  novelty: number;
  timestamp: number;
  used: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  ideaScore: number;
  status: ProjectStatus;
  createdAt: number;
  sourceDesire?: string;
}

export interface JournalEntry {
  date: string;
  content: string;
  timestamp: number;
}

export interface CORTEXConfig {
  autonomyLevel: AutonomyLevel;
  timezone: string;
  curiosityIntervalHours: number;
  enableJournaling: boolean;
  enableMorningScan: boolean;
  enableIdleExploration: boolean;
  memoryBackend: "qmd" | "builtin";
  communicationStyle: string;
  requireApprovalFor: RiskLevel[];
  desireDecayBaseRate: number;
  maxDesires: number;
  diminishingReturns: boolean;
  rewardDiminishingReturns: boolean;
}

export interface CORTEXIdentity {
  agentName: string;
  userName: string;
  style: string;
  interests: string[];
  goals: string[];
}

export interface CORTEXState {
  version: number;
  initialized: boolean;
  needsSetup: boolean;
  passiveMode: boolean;
  timezone: string;
  identity: CORTEXIdentity;
  config: CORTEXConfig;
  desires: Desire[];
  reward: {
    score: number;
    weekDelta: number;
    history: RewardEntry[];
    lastActionTime: number;
    sameTypeCounter: number;
    lastActionType: string;
    flowStateTurns: number;
  };
  discoveries: Discovery[];
  projects: Project[];
  journals: JournalEntry[];
  boredomCounter: number;
  settingsVersion: number;
}
