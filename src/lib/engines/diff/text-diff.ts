/**
 * Line-based diff using the longest-common-subsequence (LCS) algorithm.
 * Produces a list of diff rows suitable for side-by-side or inline rendering.
 */

export type DiffOp = "equal" | "add" | "remove";

export interface DiffRow {
  op: DiffOp;
  /** 1-based line number in the original (undefined for additions). */
  leftLine?: number;
  /** 1-based line number in the modified (undefined for removals). */
  rightLine?: number;
  text: string;
}

export interface DiffSummary {
  added: number;
  removed: number;
  unchanged: number;
}

export interface TextDiffResult {
  rows: DiffRow[];
  summary: DiffSummary;
}

/** Compute the LCS length table for two line arrays. */
function lcsTable(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const table: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      table[i]![j] =
        a[i] === b[j]
          ? table[i + 1]![j + 1]! + 1
          : Math.max(table[i + 1]![j]!, table[i]![j + 1]!);
    }
  }
  return table;
}

/** Diff two blocks of text line-by-line. */
export function diffLines(left: string, right: string): TextDiffResult {
  const a = left.split("\n");
  const b = right.split("\n");
  const table = lcsTable(a, b);

  const rows: DiffRow[] = [];
  const summary: DiffSummary = { added: 0, removed: 0, unchanged: 0 };
  let i = 0;
  let j = 0;
  let leftLine = 1;
  let rightLine = 1;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      rows.push({
        op: "equal",
        leftLine: leftLine++,
        rightLine: rightLine++,
        text: a[i]!,
      });
      summary.unchanged++;
      i++;
      j++;
    } else if (table[i + 1]![j]! >= table[i]![j + 1]!) {
      rows.push({ op: "remove", leftLine: leftLine++, text: a[i]! });
      summary.removed++;
      i++;
    } else {
      rows.push({ op: "add", rightLine: rightLine++, text: b[j]! });
      summary.added++;
      j++;
    }
  }
  while (i < a.length) {
    rows.push({ op: "remove", leftLine: leftLine++, text: a[i]! });
    summary.removed++;
    i++;
  }
  while (j < b.length) {
    rows.push({ op: "add", rightLine: rightLine++, text: b[j]! });
    summary.added++;
    j++;
  }

  return { rows, summary };
}
