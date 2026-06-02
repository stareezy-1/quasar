/**
 * Case conversion utilities. Each function takes raw text and returns the
 * transformed string. Word splitting is shared so all cases behave alike.
 */

/** Split text into lowercase word tokens, handling camelCase and delimiters. */
export function toWords(input: string): string[] {
  return (
    input
      // Insert spaces at camelCase boundaries.
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      // Split on non-alphanumeric.
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())
  );
}

const cap = (w: string) => (w ? w[0]!.toUpperCase() + w.slice(1) : w);

export function toCamelCase(input: string): string {
  const words = toWords(input);
  return words.map((w, i) => (i === 0 ? w : cap(w))).join("");
}

export function toPascalCase(input: string): string {
  return toWords(input).map(cap).join("");
}

export function toSnakeCase(input: string): string {
  return toWords(input).join("_");
}

export function toKebabCase(input: string): string {
  return toWords(input).join("-");
}

export function toConstantCase(input: string): string {
  return toWords(input).join("_").toUpperCase();
}

export function toTitleCase(input: string): string {
  return toWords(input).map(cap).join(" ");
}

export function toSentenceCase(input: string): string {
  const words = toWords(input);
  return words.length ? cap(words.join(" ")) : "";
}

export function toUpperCase(input: string): string {
  return input.toUpperCase();
}

export function toLowerCase(input: string): string {
  return input.toLowerCase();
}

/** Swap the case of each character. */
export function toToggleCase(input: string): string {
  return input
    .split("")
    .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
    .join("");
}

export type CaseKind =
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "title"
  | "sentence"
  | "upper"
  | "lower"
  | "toggle";

export const CASE_CONVERTERS: Record<CaseKind, (s: string) => string> = {
  camel: toCamelCase,
  pascal: toPascalCase,
  snake: toSnakeCase,
  kebab: toKebabCase,
  constant: toConstantCase,
  title: toTitleCase,
  sentence: toSentenceCase,
  upper: toUpperCase,
  lower: toLowerCase,
  toggle: toToggleCase,
};

export const CASE_LABELS: Record<CaseKind, string> = {
  camel: "camelCase",
  pascal: "PascalCase",
  snake: "snake_case",
  kebab: "kebab-case",
  constant: "CONSTANT_CASE",
  title: "Title Case",
  sentence: "Sentence case",
  upper: "UPPERCASE",
  lower: "lowercase",
  toggle: "tOGGLE cASE",
};
