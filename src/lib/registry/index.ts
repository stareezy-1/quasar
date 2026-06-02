/**
 * Registry lookup helpers. Everything that needs to know about tools imports
 * from here.
 */

import type { ToolCategory, ToolMeta } from "@/types/tool";
import { TOOLS } from "./tools";
import { CATEGORIES, CATEGORY_ORDER } from "./categories";

export { TOOLS } from "./tools";
export { CATEGORIES, CATEGORY_ORDER } from "./categories";

/** Map for O(1) id lookups. */
const BY_ID = new Map<string, ToolMeta>(TOOLS.map((t) => [t.id, t]));

/** Find a tool by id. */
export function getToolById(id: string): ToolMeta | undefined {
  return BY_ID.get(id);
}

/** All tools in a category. */
export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}

/** All tool ids (used for static params). */
export function getAllToolIds(): string[] {
  return TOOLS.map((t) => t.id);
}

/**
 * Fuzzy-ish search across name, description, and keywords. Case-insensitive,
 * scored so name matches rank above keyword matches.
 */
export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  const terms = q.split(/\s+/);

  const scored = TOOLS.map((tool) => {
    const haystackName = tool.name.toLowerCase();
    const haystackKeywords = tool.keywords.join(" ").toLowerCase();
    const haystackDesc = tool.description.toLowerCase();

    let score = 0;
    for (const term of terms) {
      if (haystackName.includes(term)) score += 3;
      if (haystackKeywords.includes(term)) score += 2;
      if (haystackDesc.includes(term)) score += 1;
    }
    return { tool, score };
  }).filter((s) => s.score > 0);

  scored.sort(
    (a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name),
  );
  return scored.map((s) => s.tool);
}

/** Count of tools (for marketing copy etc.). */
export const TOOL_COUNT = TOOLS.length;

/** Re-export category metadata helper. */
export function getCategoryMeta(category: ToolCategory) {
  return CATEGORIES[category];
}

export { CATEGORY_ORDER as categoryOrder };
