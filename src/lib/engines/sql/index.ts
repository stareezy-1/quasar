/**
 * Lightweight SQL INSERT parser. Extracts rows from `INSERT INTO ... VALUES`
 * statements into an array of objects, enabling SQL → JSON/CSV/etc. conversion.
 *
 * This is a pragmatic parser for the common single/multi-row INSERT shape, not
 * a full SQL grammar.
 */

import { type EngineResult, ok, err } from "@/types/engines";

/** Split a comma-separated value list, respecting quotes and parentheses. */
function splitValues(segment: string): string[] {
  const values: string[] = [];
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < segment.length; i++) {
    const ch = segment[i]!;
    if (inString) {
      if (ch === stringChar) {
        // Handle escaped quote ('').
        if (segment[i + 1] === stringChar) {
          current += ch;
          i++;
        } else {
          inString = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
    } else if (ch === ",") {
      values.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim() !== "") values.push(current.trim());
  return values;
}

/** Coerce a raw SQL literal into a JS value. */
function coerce(raw: string): unknown {
  const v = raw.trim();
  if (/^null$/i.test(v)) return null;
  if (/^true$/i.test(v)) return true;
  if (/^false$/i.test(v)) return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}

interface ParsedInsert {
  table: string;
  columns: string[];
  rows: Record<string, unknown>[];
}

/** Parse SQL INSERT statements into structured rows. */
export function parseSqlInserts(input: string): EngineResult<ParsedInsert[]> {
  if (!input.trim()) return err("Input is empty.");

  const statements = input
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  const inserts: ParsedInsert[] = [];

  const re =
    /insert\s+into\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)\s*values\s*(.+)/is;

  for (const stmt of statements) {
    const match = re.exec(stmt);
    if (!match) continue;
    const table = match[1]!;
    const columns = splitValues(match[2]!).map((c) =>
      c.replace(/[`"']/g, "").trim(),
    );

    // Extract each (...) group from the VALUES clause.
    const tuples = match[3]!.match(/\(([^)]*)\)/g) ?? [];
    const rows: Record<string, unknown>[] = [];
    for (const tuple of tuples) {
      const inner = tuple.slice(1, -1);
      const vals = splitValues(inner).map(coerce);
      const row: Record<string, unknown> = {};
      columns.forEach((col, idx) => {
        row[col] = vals[idx] ?? null;
      });
      rows.push(row);
    }
    if (rows.length > 0) inserts.push({ table, columns, rows });
  }

  if (inserts.length === 0) {
    return err("No valid INSERT statements found.");
  }
  return ok(inserts);
}

/** Flatten all parsed INSERTs into a single array of row objects. */
export function sqlToRows(
  input: string,
): EngineResult<Record<string, unknown>[]> {
  const parsed = parseSqlInserts(input);
  if (!parsed.ok) return parsed;
  return ok(parsed.value.flatMap((ins) => ins.rows));
}
