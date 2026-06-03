"use client";

/**
 * HtmlConverter — generic HTML table → data format converter.
 * Handles: html-to-csv, html-to-tsv, html-to-json, html-to-xml, html-to-yaml,
 * html-to-text, html-to-bbcode, html-to-pug, html-to-jade.
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
import {
  htmlTableToCsv,
  htmlTableToTsv,
  htmlTableToJson,
  htmlTableToXml,
  htmlTableToYaml,
  htmlToText,
  htmlToBbcode,
  htmlToPug,
} from "@/lib/engines/html";

type Converter = (input: string) => EngineResult<string>;

const CONVERTERS: Record<string, Converter> = {
  "html-to-csv": htmlTableToCsv,
  "html-to-tsv": htmlTableToTsv,
  "html-to-json": htmlTableToJson,
  "html-to-xml": htmlTableToXml,
  "html-to-yaml": htmlTableToYaml,
  "html-to-text": htmlToText,
  "html-to-bbcode": htmlToBbcode,
  "html-to-pug": htmlToPug,
  "html-to-jade": htmlToPug,
};

const EXT: Record<string, string> = {
  "html-to-csv": "csv",
  "html-to-tsv": "tsv",
  "html-to-json": "json",
  "html-to-xml": "xml",
  "html-to-yaml": "yaml",
  "html-to-text": "txt",
  "html-to-bbcode": "txt",
  "html-to-pug": "pug",
  "html-to-jade": "jade",
};

export default function HtmlConverter() {
  const tool = useToolMeta();
  const convert = useMemo(() => CONVERTERS[tool.id] ?? htmlToText, [tool.id]);
  const ext = useMemo(() => EXT[tool.id] ?? "txt", [tool.id]);

  const transform = useCallback((input: string) => convert(input), [convert]);

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
          downloadName={`output.${ext}`}
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="HTML Input"
          value={input}
          onChange={setInput}
          placeholder="<table>…"
        />
        <CodeEditor
          label="Output"
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
