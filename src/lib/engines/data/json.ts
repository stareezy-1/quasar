/**
 * JSON parse / serialize / format helpers built on the standard JSON API,
 * wrapped to return EngineResults with friendly error messages.
 */

import { type EngineResult, ok, err } from "@/types/engines";

/** Parse JSON text into a JS value. */
export function parseJson(input: string): EngineResult<unknown> {
  if (!input.trim()) return err("Input is empty.");
  try {
    return ok(JSON.parse(input));
  } catch (e) {
    return err(jsonErrorMessage(e, input));
  }
}

/** Pretty-print a JS value as JSON with the given indent. */
export function stringifyJson(value: unknown, indent = 2): string {
  return JSON.stringify(value, null, indent);
}

/** Format (prettify) JSON text. */
export function formatJson(input: string, indent = 2): EngineResult<string> {
  const parsed = parseJson(input);
  if (!parsed.ok) return parsed;
  return ok(stringifyJson(parsed.value, indent));
}

/** Minify JSON text to a single line. */
export function minifyJson(input: string): EngineResult<string> {
  const parsed = parseJson(input);
  if (!parsed.ok) return parsed;
  return ok(JSON.stringify(parsed.value));
}

/**
 * Turn a JSON SyntaxError into a friendlier message, extracting a line/column
 * from the "position" hint when present.
 */
function jsonErrorMessage(e: unknown, input: string): string {
  if (!(e instanceof Error)) return "Invalid JSON.";
  const match = /position (\d+)/.exec(e.message);
  if (match) {
    const pos = Number(match[1]);
    const before = input.slice(0, pos);
    const line = before.split("\n").length;
    const col = pos - before.lastIndexOf("\n");
    return `${e.message} (line ${line}, column ${col})`;
  }
  return e.message;
}
