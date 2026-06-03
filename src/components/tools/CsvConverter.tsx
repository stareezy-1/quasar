"use client";

/**
 * CsvConverter — CSV to TSV, CSV to SQL, CSV to HTML, CSV to multiline.
 * Also handles xml-to-csv, xml-to-tsv, json-to-tsv, json-to-text, etc.
 * by delegating to the data engine for standard pairs and custom logic for the rest.
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
import type { EngineResult } from "@/types/engines";
import { ok, err } from "@/types/engines";
import {
  parseCsv,
  parseTsv,
  serializeCsv,
  serializeTsv,
} from "@/lib/engines/data";
import { convertData, type DataFormat } from "@/lib/engines/data";
import { generateHtmlTable } from "@/lib/engines/html";

function csvToSql(input: string, tableName = "data"): EngineResult<string> {
  const r = parseCsv(input);
  if (!r.ok) return r;
  const rows = r.value as Record<string, unknown>[];
  if (!rows.length) return err("No data rows found.");
  const cols = Object.keys(rows[0]!);
  const colList = cols.map((c) => `\`${c}\``).join(", ");
  const stmts = rows.map((row) => {
    const vals = cols
      .map((c) => {
        const v = row[c];
        if (v === null || v === undefined) return "NULL";
        if (typeof v === "number") return String(v);
        return `'${String(v).replace(/'/g, "''")}'`;
      })
      .join(", ");
    return `INSERT INTO \`${tableName}\` (${colList}) VALUES (${vals});`;
  });
  return ok(stmts.join("\n"));
}

function csvToMultiline(input: string): EngineResult<string> {
  const r = parseCsv(input);
  if (!r.ok) return r;
  const rows = r.value as Record<string, unknown>[];
  if (!rows.length) return err("No data found.");
  const lines = rows.map((row) => Object.values(row).map(String).join(" | "));
  return ok(lines.join("\n"));
}

function tsvToCsv(input: string): EngineResult<string> {
  const r = parseTsv(input);
  if (!r.ok) return r;
  return serializeCsv(r.value);
}

function csvToTsv(input: string): EngineResult<string> {
  const r = parseCsv(input);
  if (!r.ok) return r;
  return serializeTsv(r.value);
}

type Converter = (input: string) => EngineResult<string>;

const EXT: Record<string, string> = {
  "csv-to-tsv": "tsv",
  "csv-to-sql": "sql",
  "csv-to-html": "html",
  "csv-to-multiline": "txt",
  "tsv-to-csv": "csv",
  "json-to-tsv": "tsv",
  "xml-to-tsv": "tsv",
  "yaml-to-tsv": "tsv",
  "json-to-text": "txt",
  "xml-to-text": "txt",
};

export default function CsvConverter() {
  const tool = useToolMeta();

  const convert = useMemo((): Converter => {
    switch (tool.id) {
      case "csv-to-tsv":
        return csvToTsv;
      case "csv-to-sql":
        return csvToSql;
      case "csv-to-html":
        return generateHtmlTable;
      case "csv-to-multiline":
        return csvToMultiline;
      case "tsv-to-csv":
        return tsvToCsv;
      default: {
        // Standard data engine pair e.g. json-to-tsv, xml-to-text
        const [from, , to] = tool.id.split("-");
        if (to === "text")
          return (i) => {
            const r = convertData(i, (from ?? "json") as DataFormat, "json");
            if (!r.ok) return r;
            return ok(r.value);
          };
        return (i) =>
          convertData(
            i,
            (from ?? "json") as DataFormat,
            (to ?? "json") as DataFormat,
          );
      }
    }
  }, [tool.id]);

  const ext = useMemo(() => EXT[tool.id] ?? "txt", [tool.id]);

  const transform = useCallback((input: string) => convert(input), [convert]);

  const { input, setInput, output, error, clear, sessions, save, load } =
    useStandardTool({ toolId: tool.id, transform });

  const [fromLabel, toLabel] = useMemo(() => {
    const [f, , t] = tool.id.split("-");
    return [(f ?? "Input").toUpperCase(), (t ?? "Output").toUpperCase()];
  }, [tool.id]);

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
          downloadName={`output.${ext}`}
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label={`Input — ${fromLabel}`}
          value={input}
          onChange={setInput}
          placeholder={`Paste ${fromLabel} here…`}
        />
        <CodeEditor
          label={`Output — ${toLabel}`}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
