"use client";

/**
 * DataDiff — compares two inputs. For "json-diff" it shows a semantic key-level
 * diff; for "text-diff" it shows a line-by-line diff. Two editors feed a colored
 * diff view plus a summary bar.
 */

import { useCallback, useMemo, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, ErrorBanner } from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useSessions } from "@/hooks";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { diffLines, type DiffRow } from "@/lib/engines/diff";
import { diffJson, type JsonChange } from "@/lib/engines/diff";
import { parseJson } from "@/lib/engines/data";
import { Button } from "@/components/tool-shell";

const OP_COLORS: Record<string, string> = {
  equal: "var(--color-text-muted)",
  add: "var(--color-success)",
  remove: "var(--color-error)",
};

const KIND_COLORS: Record<string, string> = {
  added: "var(--color-success)",
  removed: "var(--color-error)",
  changed: "var(--color-warning)",
};

export default function DataDiff() {
  const tool = useToolMeta();
  const isJson = tool.id === "json-diff";

  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const dl = useDebouncedValue(left, 250);
  const dr = useDebouncedValue(right, 250);

  const sessions = useSessions(tool.id);

  const save = useCallback(() => {
    const name = window.prompt("Name this session");
    if (name === null) return;
    sessions.save(name, { input: left, inputB: right });
  }, [sessions, left, right]);

  // Text diff result.
  const textDiff = useMemo(() => {
    if (isJson) return null;
    return diffLines(dl, dr);
  }, [isJson, dl, dr]);

  // JSON diff result.
  const jsonDiff = useMemo(() => {
    if (!isJson) return null;
    if (!dl.trim() || !dr.trim())
      return { changes: [] as JsonChange[], error: null };
    const a = parseJson(dl);
    if (!a.ok) return { changes: [], error: `Left: ${a.error}` };
    const b = parseJson(dr);
    if (!b.ok) return { changes: [], error: `Right: ${b.error}` };
    return { changes: diffJson(a.value, b.value), error: null };
  }, [isJson, dl, dr]);

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      toolbar={
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}
        >
          <Button
            variant="ghost"
            onClick={() => {
              setLeft("");
              setRight("");
            }}
          >
            Clear
          </Button>
          <Button variant="ghost" onClick={save}>
            ＋ Save
          </Button>
        </div>
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="Original"
          value={left}
          onChange={setLeft}
          placeholder={isJson ? '{ "a": 1 }' : "first text"}
        />
        <CodeEditor
          label="Modified"
          value={right}
          onChange={setRight}
          placeholder={isJson ? '{ "a": 2 }' : "second text"}
        />
      </div>

      {jsonDiff?.error && <ErrorBanner message={jsonDiff.error} />}

      {/* Summary */}
      {textDiff && (
        <DiffSummary
          added={textDiff.summary.added}
          removed={textDiff.summary.removed}
          changed={0}
        />
      )}
      {jsonDiff && !jsonDiff.error && (
        <DiffSummary
          added={jsonDiff.changes.filter((c) => c.kind === "added").length}
          removed={jsonDiff.changes.filter((c) => c.kind === "removed").length}
          changed={jsonDiff.changes.filter((c) => c.kind === "changed").length}
        />
      )}

      {/* Output */}
      <div
        className="mono"
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "0.5rem",
          backgroundColor: "var(--color-surface)",
          padding: "0.75rem 1rem",
          fontSize: "0.8125rem",
          lineHeight: 1.7,
          overflowX: "auto",
          minHeight: "120px",
        }}
      >
        {textDiff &&
          textDiff.rows.map((row, i) => <TextDiffLine key={i} row={row} />)}
        {jsonDiff && !jsonDiff.error && jsonDiff.changes.length === 0 && (
          <span style={{ color: "var(--color-text-muted)" }}>
            No differences.
          </span>
        )}
        {jsonDiff &&
          jsonDiff.changes.map((c, i) => (
            <div key={i} style={{ color: KIND_COLORS[c.kind] }}>
              <strong>{c.kind}</strong> {c.path}
              {c.kind === "changed" && (
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {"  "}
                  {JSON.stringify(c.oldValue)} → {JSON.stringify(c.newValue)}
                </span>
              )}
              {c.kind === "added" && (
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {"  "}
                  {JSON.stringify(c.newValue)}
                </span>
              )}
              {c.kind === "removed" && (
                <span style={{ color: "var(--color-text-secondary)" }}>
                  {"  "}
                  {JSON.stringify(c.oldValue)}
                </span>
              )}
            </div>
          ))}
      </div>
    </ToolShell>
  );
}

function TextDiffLine({ row }: { row: DiffRow }) {
  const prefix = row.op === "add" ? "+ " : row.op === "remove" ? "- " : "  ";
  return (
    <div
      style={{
        color: OP_COLORS[row.op],
        backgroundColor:
          row.op === "add"
            ? "color-mix(in srgb, var(--color-success) 12%, transparent)"
            : row.op === "remove"
            ? "color-mix(in srgb, var(--color-error) 12%, transparent)"
            : "transparent",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {prefix}
      {row.text}
    </div>
  );
}

function DiffSummary({
  added,
  removed,
  changed,
}: {
  added: number;
  removed: number;
  changed: number;
}) {
  const chip = (label: string, n: number, color: string) => (
    <span style={{ color, fontSize: "0.8125rem", fontWeight: 600 }}>
      {n} {label}
    </span>
  );
  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {chip("added", added, "var(--color-success)")}
      {chip("removed", removed, "var(--color-error)")}
      {changed > 0 && chip("changed", changed, "var(--color-warning)")}
    </div>
  );
}
