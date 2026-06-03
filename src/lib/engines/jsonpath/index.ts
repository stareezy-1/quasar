/**
 * JSONPath tester — evaluates a JSONPath expression against JSON input.
 * Implements a subset of JSONPath: $, .key, [*], [n], ..key (recursive descent),
 * ['key'], [?(@.key op val)] filter expressions.
 */

import { type EngineResult, ok, err } from "@/types/engines";
import { parseJson } from "@/lib/engines/data/json";

export interface JsonPathResult {
  matches: unknown[];
  json: string;
}

export function testJsonPath(
  jsonInput: string,
  path: string,
): EngineResult<JsonPathResult> {
  if (!jsonInput.trim()) return err("Enter JSON input.");
  if (!path.trim()) return err("Enter a JSONPath expression.");

  const parsed = parseJson(jsonInput);
  if (!parsed.ok) return parsed;

  try {
    const matches = query(parsed.value, path.trim());
    return ok({ matches, json: JSON.stringify(matches, null, 2) });
  } catch (e) {
    return err(e instanceof Error ? e.message : "JSONPath error.");
  }
}

function query(root: unknown, path: string): unknown[] {
  if (!path.startsWith("$")) throw new Error('JSONPath must start with "$".');
  const tokens = tokenize(path.slice(1));
  return evaluate([root], tokens);
}

function tokenize(path: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < path.length) {
    if (path[i] === ".") {
      if (path[i + 1] === ".") {
        tokens.push("..");
        i += 2;
      } else i++;
    } else if (path[i] === "[") {
      const end = path.indexOf("]", i);
      if (end === -1) throw new Error("Unclosed [");
      tokens.push(path.slice(i, end + 1));
      i = end + 1;
    } else {
      const end = path.slice(i).search(/[.\[]/);
      if (end === -1) {
        tokens.push(path.slice(i));
        break;
      }
      tokens.push(path.slice(i, i + end));
      i += end;
    }
  }
  return tokens.filter(Boolean);
}

function evaluate(nodes: unknown[], tokens: string[]): unknown[] {
  let current = nodes;
  for (const token of tokens) {
    if (token === "..") {
      current = current.flatMap(descend);
    } else if (token === "*") {
      current = current.flatMap(allChildren);
    } else if (token.startsWith("[")) {
      const inner = token.slice(1, -1).trim();
      if (inner === "*") {
        current = current.flatMap(allChildren);
      } else if (inner.startsWith("?")) {
        current = current.flatMap((n) => filterExpr(n, inner.slice(1).trim()));
      } else if (/^\d+$/.test(inner)) {
        current = current.flatMap((n) =>
          Array.isArray(n)
            ? n[Number(inner)] !== undefined
              ? [n[Number(inner)]]
              : []
            : [],
        );
      } else {
        const key = inner.replace(/^['"]|['"]$/g, "");
        current = current.flatMap((n) => getKey(n, key));
      }
    } else {
      current = current.flatMap((n) => getKey(n, token));
    }
  }
  return current;
}

function getKey(node: unknown, key: string): unknown[] {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    const val = (node as Record<string, unknown>)[key];
    return val !== undefined ? [val] : [];
  }
  return [];
}

function allChildren(node: unknown): unknown[] {
  if (Array.isArray(node)) return node as unknown[];
  if (node && typeof node === "object") return Object.values(node as object);
  return [];
}

function descend(node: unknown): unknown[] {
  const result: unknown[] = [node];
  if (Array.isArray(node)) {
    for (const item of node) result.push(...descend(item));
  } else if (node && typeof node === "object") {
    for (const val of Object.values(node as object))
      result.push(...descend(val));
  }
  return result;
}

function filterExpr(node: unknown, expr: string): unknown[] {
  if (!Array.isArray(node)) return [];
  // Basic filter: (@.key op value) or (@.key)
  const m = /^\(\s*@\.(\w+)\s*(?:(==|!=|>=|<=|>|<)\s*(.+))?\s*\)$/.exec(expr);
  if (!m) return [];
  const [, key, op, rawVal] = m;
  return (node as unknown[]).filter((item) => {
    if (!item || typeof item !== "object") return false;
    const val = (item as Record<string, unknown>)[key!];
    if (!op) return val !== undefined;
    const cmp = coerceVal(rawVal!);
    switch (op) {
      case "==":
        return val == cmp;
      case "!=":
        return val != cmp;
      case ">":
        return (val as number) > (cmp as number);
      case "<":
        return (val as number) < (cmp as number);
      case ">=":
        return (val as number) >= (cmp as number);
      case "<=":
        return (val as number) <= (cmp as number);
      default:
        return false;
    }
  });
}

function coerceVal(s: string): unknown {
  const t = s.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (t === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return t.replace(/^['"]|['"]$/g, "");
}
