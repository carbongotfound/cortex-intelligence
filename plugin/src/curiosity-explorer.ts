// Cortex Intelligence — Curiosity Explorer
// Exploration logic, novelty scoring, topic generation.

import { Discovery } from "./types";

// Generate a unique discovery ID
let discCounter = 0;
export function generateDiscoveryId(): string {
  discCounter++;
  return `disc_${String(Date.now()).slice(-6)}_${discCounter}`;
}

// Calculate curiosity score (decides whether to explore)
export function calculateCuriosity(
  avgDesireStrength: number,
  noveltyBias: number,
  idleHours: number
): number {
  return avgDesireStrength * 0.4 + noveltyBias * 0.3 + idleHours * 0.3 + Math.random() * 10;
}

// Calculate novelty score for a discovery (0-1)
export function calculateNovelty(
  summary: string,
  existingDiscoveries: Discovery[]
): number {
  if (existingDiscoveries.length === 0) {
    return 0.9;
  }

  const words = new Set(summary.toLowerCase().split(/\s+/).filter((w) => w.length > 3));

  let maxSimilarity = 0;
  for (const existing of existingDiscoveries) {
    const existingWords = new Set(
      existing.summary.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
    );
    const intersection = new Set([...words].filter((w) => existingWords.has(w)));
    const union = new Set([...words, ...existingWords]);
    const similarity = union.size > 0 ? intersection.size / union.size : 0;
    maxSimilarity = Math.max(maxSimilarity, similarity);
  }

  const novelty = 1 - maxSimilarity;
  return Math.max(0, Math.min(1, novelty));
}

// Create a discovery entry
export function createDiscovery(
  source: string,
  summary: string,
  relevance: number,
  novelty: number
): Discovery {
  return {
    id: generateDiscoveryId(),
    source,
    summary,
    relevance,
    novelty,
    timestamp: Date.now(),
    used: false,
  };
}

// Check if topic is blocked by forced variety
export function isExplorationBlocked(
  topic: string,
  discoveries: Discovery[],
  blockHours: number = 24
): boolean {
  const cutoff = Date.now() - blockHours * 3600000;
  const recentRelated = discoveries.filter(
    (d) =>
      d.timestamp > cutoff &&
      d.summary.toLowerCase().includes(topic.toLowerCase())
  );
  return recentRelated.length >= 3;
}

// Generate exploration topics based on desires and past discoveries
export function generateExplorationTopics(
  desires: { description: string; strength: number }[],
  discoveries: Discovery[]
): string[] {
  const topics: string[] = [];

  const sorted = [...desires].sort((a, b) => b.strength - a.strength);
  for (const d of sorted.slice(0, 3)) {
    const words = d.description
      .split(/\s+/)
      .filter((w) => w.length > 4 && !["about", "their", "there", "these", "those", "which", "would", "could"].includes(w.toLowerCase()));
    if (words.length > 0) {
      topics.push(words.join(" "));
    }
  }

  const simpleQueries = ["latest developments in", "new tools for", "emerging trends in", "best practices for", "comparison of"];
  for (const topic of topics.slice(0, 2)) {
    for (const q of simpleQueries.slice(0, 2)) {
      if (!isExplorationBlocked(`${q} ${topic}`, discoveries, 24)) {
        topics.push(`${q} ${topic}`);
      }
    }
  }

  return topics.slice(0, 5);
}
