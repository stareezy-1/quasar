/**
 * Semantic, key-level diff between two JSON-compatible values. Walks both trees
 * in parallel and records added / removed / changed paths.
 */

export type JsonChangeKind = "added" | "removed" | "changed";

export interface JsonChange {
  /** Dotted path to the changed location (e.g. `user.address.city`). */
  path: string;
  kind: JsonChangeKind;
  /** Previous value (for removed / changed). */
  oldValue?: unknown;
  /** New value (for added / changed). */
  newValue?: unknown;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function join(base: string, key: string | number): string {
  if (base === "") return String(key);
  return typeof key === "number" ? `${base}[${key}]` : `${base}.${key}`;
}

/** Recursively diff two values, accumulating changes. */
export function diffJson(
  oldValue: unknown,
  newValue: unknown,
  path = "",
  acc: JsonChange[] = [],
): JsonChange[] {
  if (oldValue === newValue) return acc;

  // Both objects → recurse over the union of keys.
  if (isObject(oldValue) && isObject(newValue)) {
    const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
    for (const key of keys) {
      const inOld = key in oldValue;
      const inNew = key in newValue;
      const p = join(path, key);
      if (inOld && !inNew) {
        acc.push({ path: p, kind: "removed", oldValue: oldValue[key] });
      } else if (!inOld && inNew) {
        acc.push({ path: p, kind: "added", newValue: newValue[key] });
      } else {
        diffJson(oldValue[key], newValue[key], p, acc);
      }
    }
    return acc;
  }

  // Both arrays → diff index by index.
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    const len = Math.max(oldValue.length, newValue.length);
    for (let idx = 0; idx < len; idx++) {
      const p = join(path, idx);
      if (idx >= newValue.length) {
        acc.push({ path: p, kind: "removed", oldValue: oldValue[idx] });
      } else if (idx >= oldValue.length) {
        acc.push({ path: p, kind: "added", newValue: newValue[idx] });
      } else {
        diffJson(oldValue[idx], newValue[idx], p, acc);
      }
    }
    return acc;
  }

  // Primitives (or type mismatch) → changed.
  acc.push({ path: path || "(root)", kind: "changed", oldValue, newValue });
  return acc;
}
