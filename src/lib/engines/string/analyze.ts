/** Text analysis: counts and word frequency. */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
}

export function analyzeText(input: string): TextStats {
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const sentences = input.trim()
    ? (input.match(/[.!?]+(\s|$)/g) ?? []).length || (input.trim() ? 1 : 0)
    : 0;
  const paragraphs = input.trim()
    ? input.split(/\n\s*\n/).filter((p) => p.trim()).length
    : 0;
  return {
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, "").length,
    words,
    lines: input ? input.split("\n").length : 0,
    sentences,
    paragraphs,
  };
}

export interface WordFrequency {
  word: string;
  count: number;
}

/** Count word frequencies, sorted by count desc then alphabetically. */
export function wordFrequency(input: string): WordFrequency[] {
  const counts = new Map<string, number>();
  const words = input.toLowerCase().match(/\b[\w'-]+\b/g) ?? [];
  for (const w of words) {
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}
