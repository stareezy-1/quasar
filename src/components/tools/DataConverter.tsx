"use client";

/**
 * DataConverter — generic format-to-format converter used by every data
 * conversion tool (json-to-xml, csv-to-json, xml-to-yaml, …). It parses the
 * from/to formats out of the tool id ("{from}-to-{to}").
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
import {
  convertData,
  type DataFormat,
  DATA_FORMAT_EXTENSIONS,
  DATA_FORMAT_LABELS,
} from "@/lib/engines/data";

/** Parse "{from}-to-{to}" from a tool id. */
function parsePair(id: string): { from: DataFormat; to: DataFormat } {
  const [from, , to] = id.split("-");
  return {
    from: (from ?? "json") as DataFormat,
    to: (to ?? "json") as DataFormat,
  };
}

export default function DataConverter() {
  const tool = useToolMeta();
  const { from, to } = useMemo(() => parsePair(tool.id), [tool.id]);

  const transform = useCallback(
    (input: string) => convertData(input, from, to),
    [from, to],
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
          downloadName={`converted.${DATA_FORMAT_EXTENSIONS[to]}`}
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label={`Input — ${DATA_FORMAT_LABELS[from]}`}
          value={input}
          onChange={setInput}
          placeholder={`Paste ${DATA_FORMAT_LABELS[from]} here…`}
        />
        <CodeEditor
          label={`Output — ${DATA_FORMAT_LABELS[to]}`}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
