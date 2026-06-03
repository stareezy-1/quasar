"use client";

/**
 * SqlConverter — parses SQL INSERT statements into rows, then serializes to the
 * target format (JSON or CSV) derived from the tool id "sql-to-{target}".
 */

import { useCallback, useMemo } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import {
  ToolShell,
  ToolBar,
  StatsBar,
  SessionsPanel,
} from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useStandardTool } from "@/hooks";
import { type EngineResult } from "@/types/engines";
import { sqlToRows } from "@/lib/engines/sql";
import { serializeData, type DataFormat } from "@/lib/engines/data";
import { generateHtmlTable } from "@/lib/engines/html";

function targetFromId(id: string): DataFormat {
  const target = id.split("-").pop();
  const validFormats: DataFormat[] = ["json", "csv", "xml", "yaml", "tsv"];
  if (validFormats.includes(target as DataFormat)) return target as DataFormat;
  return "json";
}

export default function SqlConverter() {
  const tool = useToolMeta();
  const target = useMemo(() => targetFromId(tool.id), [tool.id]);

  const transform = useCallback(
    (input: string): EngineResult<string> => {
      const rows = sqlToRows(input);
      if (!rows.ok) return rows;
      // sql-to-html: generate an HTML table directly from rows
      if (tool.id === "sql-to-html") {
        // Convert rows to CSV string then pass to HTML table generator
        const headers = rows.value.length ? Object.keys(rows.value[0]!) : [];
        const csvLines = [
          headers.join(","),
          ...rows.value.map((r) =>
            headers
              .map((h) => {
                const v = String(r[h] ?? "");
                return v.includes(",") ? `"${v.replace(/"/g, '""')}"` : v;
              })
              .join(","),
          ),
        ];
        return generateHtmlTable(csvLines.join("\n"));
      }
      return serializeData(rows.value, target);
    },
    [target, tool.id],
  );

  const { input, setInput, output, error, clear, sessions, save, load } =
    useStandardTool({ toolId: tool.id, transform });

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={error}
      stats={<StatsBar value={output} />}
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
          downloadName={`data.${target}`}
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="SQL INSERT statements"
          value={input}
          onChange={setInput}
          placeholder="INSERT INTO users (id, name) VALUES (1, 'Ada');"
        />
        <CodeEditor
          label={`Output — ${target.toUpperCase()}`}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
