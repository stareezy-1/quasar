"use client";

/**
 * CsvViewer — render CSV data as a styled HTML table.
 */

import { useCallback, useMemo } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, ToolBar, SessionsPanel } from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useStandardTool } from "@/hooks";
import { parseCsv } from "@/lib/engines/data";
import { ok } from "@/types/engines";

export default function CsvViewer() {
  const tool = useToolMeta();

  // Transform just validates / round-trips so we can detect errors
  const transform = useCallback((input: string) => {
    if (!input.trim()) return ok("");
    const r = parseCsv(input);
    return r.ok ? ok(input) : r;
  }, []);

  const { input, setInput, output, error, clear, sessions, save, load } =
    useStandardTool({ toolId: tool.id, transform });

  const tableHtml = useMemo(() => {
    if (!input.trim()) return null;
    const r = parseCsv(input);
    if (!r.ok) return null;
    const rows = r.value as Record<string, unknown>[];
    if (!rows.length) return null;
    const headers = Object.keys(rows[0]!);
    return { headers, rows };
  }, [input]);

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={error}
      sessions={
        <SessionsPanel
          sessions={sessions.sessions}
          onLoad={load}
          onDelete={sessions.remove}
          onRename={sessions.rename}
        />
      }
      toolbar={
        <ToolBar
          output={output}
          downloadName="data.csv"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <CodeEditor
          label="CSV Input"
          value={input}
          onChange={setInput}
          placeholder={"Name,Age\nAlice,30\nBob,25"}
        />
        {tableHtml && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
              }}
            >
              <thead>
                <tr>
                  {tableHtml.headers.map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.5rem 0.75rem",
                        textAlign: "left",
                        borderBottom: "2px solid var(--color-border)",
                        color: "var(--color-brand)",
                        fontWeight: 700,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableHtml.rows.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    {tableHtml.headers.map((h) => (
                      <td
                        key={h}
                        style={{
                          padding: "0.5rem 0.75rem",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {String(row[h] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
