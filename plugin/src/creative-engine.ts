// Cortex Intelligence — Creative Engine
// Idea generation, scoring, project creation.

import { Project, Discovery, Desire } from "./types";

// Generate a unique project ID
let projectCounter = 0;
export function generateProjectId(): string {
  projectCounter++;
  return `proj_${String(Date.now()).slice(-6)}_${projectCounter}`;
}

export type BrainstormTechnique = "combine" | "analogy" | "reverse" | "extreme" | "firstPrinciples";

// Generate brainstorm prompt for the agent
export function getBrainstormPrompt(technique: BrainstormTechnique, desires: Desire[], discoveries: Discovery[]): string {
  const topDesires = desires.sort((a, b) => b.strength - a.strength).slice(0, 3);
  const recentDiscoveries = discoveries.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);

  const prompts: Record<BrainstormTechnique, string> = {
    combine: `Idea generation technique: COMBINE
Look at these topics and ask: "What if I combine these?"
- Active desires: ${topDesires.map((d) => d.description).join(", ")}
- Recent discoveries: ${recentDiscoveries.map((d) => d.summary.substring(0, 100)).join(", ")}

Generate 2-3 ideas by combining different topics above.`,

    analogy: `Idea generation technique: ANALOGY
Think about problems related to your desires and ask: "How is this like something else?"
- ${topDesires.map((d) => d.description).join("\n- ")}

Can you find analogous solutions from other domains? Generate 2-3 ideas.`,

    reverse: `Idea generation technique: REVERSE
Take your usual approach and ask: "What if I do the opposite?"
- ${topDesires.map((d) => `Instead of working on "${d.description}", what if I inverted the goal?`).join("\n- ")}

Generate 2-3 reversed-thinking ideas.`,

    extreme: `Idea generation technique: EXTREME SCENARIO
Push your desires to their logical extreme and ask: "What if we went all the way?"
- What would the ultimate version of ${topDesires[0]?.description || "your goals"} look like?
- What if resources were unlimited?

Generate 2-3 extreme ideas.`,

    firstPrinciples: `Idea generation technique: FIRST PRINCIPLES
Break down your desires into fundamental truths and rebuild from there.
- What are the core components of: ${topDesires.map((d) => d.description).join(", ")}
- What do we know is absolutely true?

Generate 2-3 first-principles ideas.`,
  };

  return prompts[technique] || prompts.combine;
}

// Rotate through techniques
const techniques: BrainstormTechnique[] = ["combine", "analogy", "reverse", "extreme", "firstPrinciples"];

export function getNextTechnique(lastTechnique: BrainstormTechnique | null): BrainstormTechnique {
  if (!lastTechnique) return "combine";
  const idx = techniques.indexOf(lastTechnique);
  return techniques[(idx + 1) % techniques.length];
}

// Score an idea (reference formula for the agent)
export function calculateIdeaScore(
  novelty: number,
  feasibility: number,
  desireAlignment: number
): number {
  return novelty * 0.4 + feasibility * 0.3 + desireAlignment * 0.3;
}

// Create a project from a scored idea
export function createProject(
  title: string,
  description: string,
  ideaScore: number,
  sourceDesire?: string
): Project {
  return {
    id: generateProjectId(),
    title,
    description,
    ideaScore,
    status: "proposed",
    createdAt: Date.now(),
    sourceDesire,
  };
}
