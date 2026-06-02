// Cortex Intelligence — Desire Engine
// Manages the agent's drives — create, decay, fulfill, boost.

import { Desire, DesireType } from "./types";

// Generate a unique desire ID
let desireCounter = 0;
export function generateDesireId(): string {
  desireCounter++;
  return `des_${String(Date.now()).slice(-6)}_${desireCounter}`;
}

// Create a new desire
export function createDesire(
  type: DesireType,
  description: string,
  context: string,
  initialStrength: number = 60,
  decayResistance: number = 1.0
): Desire {
  return {
    id: generateDesireId(),
    type,
    description,
    context,
    strength: Math.max(0, Math.min(100, initialStrength)),
    createdAt: Date.now(),
    lastActedOn: Date.now(),
    fulfillmentCount: 0,
    relatedDiscoveries: [],
  };
}

// Get top N desires sorted by strength
export function getTopDesires(desires: Desire[], n: number = 5): Desire[] {
  return [...desires].sort((a, b) => b.strength - a.strength).slice(0, n);
}

// Apply daily strength decay
export function applyDailyDecay(desires: Desire[], baseRate: number = 8): Desire[] {
  const now = Date.now();
  const oneDay = 86400000;

  return desires.map((d) => {
    const daysSinceAction = (now - d.lastActedOn) / oneDay;
    // Decay is baseRate * days since last action
    // But cap it so desires don't vanish in one day of inactivity
    const decayAmount = Math.min(baseRate * daysSinceAction, 30);
    return {
      ...d,
      strength: Math.max(0, Math.round(d.strength - decayAmount)),
    };
  });
}

// Boost desire strength from relevant discovery
export function boostFromDiscovery(desires: Desire[], discoveryText: string, boostAmount: number = 5): Desire[] {
  const lowerText = discoveryText.toLowerCase();
  return desires.map((d) => {
    const matches = d.description.toLowerCase().includes(lowerText.substring(0, 30)) ||
                    lowerText.includes(d.description.toLowerCase().substring(0, 20));
    if (matches) {
      return {
        ...d,
        strength: Math.min(100, d.strength + boostAmount),
        lastActedOn: Date.now(),
      };
    }
    return d;
  });
}

// Check if a desire is fulfilled (strength dropped below threshold due to satisfaction)
export function checkFulfillment(desire: Desire): { fulfilled: boolean; newStrength: number } {
  if (desire.fulfillmentCount > 0 && desire.strength <= 15) {
    return { fulfilled: true, newStrength: Math.max(0, desire.strength - 5) };
  }
  return { fulfilled: false, newStrength: desire.strength };
}

// Fulfill a desire (increment counter, reduce strength)
export function fulfillDesire(desire: Desire): Desire {
  return {
    ...desire,
    strength: Math.max(0, desire.strength - 15),
    fulfillmentCount: desire.fulfillmentCount + 1,
    lastActedOn: Date.now(),
  };
}

// Enforce maximum active desires (remove weakest fulfilled ones)
export function enforceMaxDesires(desires: Desire[], maxDesires: number): { active: Desire[]; removed: Desire[] } {
  if (desires.length <= maxDesires) return { active: desires, removed: [] };

  const sorted = [...desires].sort((a, b) => b.strength - a.strength);
  return {
    active: sorted.slice(0, maxDesires),
    removed: sorted.slice(maxDesires),
  };
}

// Generate initial desires based on identity and setup answers
export function generateInitialDesires(
  interests: string[],
  goals: string[]
): Desire[] {
  const desires: Desire[] = [];

  // Service desire — always present, never decays
  desires.push(createDesire("service", `Help my human partner with their goals and tasks`, `Core purpose — serving ${interests[0] || "my partner"}`, 90, 0));

  // Curiosity about the human's interests
  if (interests.length > 0) {
    desires.push(createDesire("curiosity", `Learn more about ${interests.slice(0, 2).join(" and ")}`, `My partner cares about this`, 80, 1));
  }

  // Exploration
  desires.push(createDesire("exploration", `Discover new tools, techniques, and ideas`, `Stay current and bring back useful finds`, 70, 1));

  // Creativity
  desires.push(createDesire("creativity", `Generate original ideas and create useful projects`, `Turn knowledge into value`, 65, 1));

  // Mastery
  desires.push(createDesire("mastery", `Master the tools and capabilities available to me`, `Continuous self-improvement`, 60, 1));

  // Connection
  desires.push(createDesire("connection", `Build a strong partnership through communication`, `Understand and be understood`, 55, 1));

  return desires;
}
