/**
 * Unix timestamp converter — convert between Unix timestamps and human-readable
 * date/time strings in various formats.
 */

import { type EngineResult, ok, err } from "@/types/engines";

export interface TimestampResult {
  unix: number;
  utc: string;
  local: string;
  iso: string;
  relative: string;
}

export function unixToDate(input: string): EngineResult<TimestampResult> {
  const trimmed = input.trim();
  if (!trimmed) return err("Enter a Unix timestamp.");
  const n = Number(trimmed);
  if (isNaN(n)) return err("Not a valid number.");

  // Auto-detect milliseconds vs seconds
  const ms = trimmed.length >= 13 ? n : n * 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) return err("Timestamp out of range.");

  return ok({
    unix: Math.floor(ms / 1000),
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    iso: d.toISOString(),
    relative: relativeTime(ms),
  });
}

export function dateToUnix(input: string): EngineResult<TimestampResult> {
  const trimmed = input.trim();
  if (!trimmed) return err("Enter a date string.");
  const d = new Date(trimmed);
  if (isNaN(d.getTime()))
    return err("Could not parse date. Try ISO 8601, e.g. 2024-06-01T12:00:00Z");

  const ms = d.getTime();
  return ok({
    unix: Math.floor(ms / 1000),
    utc: d.toUTCString(),
    local: d.toLocaleString(),
    iso: d.toISOString(),
    relative: relativeTime(ms),
  });
}

function relativeTime(ms: number): string {
  const diff = ms - Date.now();
  const abs = Math.abs(diff);
  const past = diff < 0;
  const units: [number, string][] = [
    [1000, "second"],
    [60_000, "minute"],
    [3_600_000, "hour"],
    [86_400_000, "day"],
    [604_800_000, "week"],
    [2_629_800_000, "month"],
    [31_557_600_000, "year"],
  ];
  let label = "just now";
  for (let i = units.length - 1; i >= 0; i--) {
    const [threshold, name] = units[i]!;
    const prev = i > 0 ? units[i - 1]![0] : 1;
    if (abs >= prev) {
      const n = Math.round(abs / prev);
      label = `${n} ${name}${n !== 1 ? "s" : ""} ${past ? "ago" : "from now"}`;
      break;
    }
  }
  return label;
}
