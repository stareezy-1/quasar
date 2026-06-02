/** YAML parse / serialize built on js-yaml, wrapped as EngineResults. */

import yaml from "js-yaml";
import { type EngineResult, ok, err } from "@/types/engines";

export function parseYaml(input: string): EngineResult<unknown> {
  if (!input.trim()) return err("Input is empty.");
  try {
    return ok(yaml.load(input));
  } catch (e) {
    return err(e instanceof Error ? e.message : "Invalid YAML.");
  }
}

export function stringifyYaml(value: unknown): string {
  return yaml.dump(value, { indent: 2, lineWidth: -1, noRefs: true });
}

export function formatYaml(input: string): EngineResult<string> {
  const parsed = parseYaml(input);
  if (!parsed.ok) return parsed;
  return ok(stringifyYaml(parsed.value));
}
