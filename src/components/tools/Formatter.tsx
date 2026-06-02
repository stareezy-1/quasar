"use client";

/**
 * Formatter — generic format/validate tool used by JSON Formatter and XML
 * Formatter. It reads the active tool id to pick the data format and exposes a
 * "Minify" toggle alongside the standard pretty-print.
 */

import { useCallback, useMemo, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import {
  ToolShell,
  ToolBar,
  StatsBar,
  SessionsPanel,
  Button,
} from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useStandardTool } from "@/hooks";
import {
  formatData,
  minifyJson,
  type DataFormat,
  DATA_FORMAT_EXTENSIONS,
} from "@/lib/engines/data";

/** Map a formatter tool id to its data format. */
function formatFromId(id: string): DataFormat {
  if (id.startsWith("xml")) return "xml";
  return "json";
}

export default function Formatter() {
  const tool = useToolMeta();
  const format = useMemo(() => formatFromId(tool.id), [tool.id]);
  const [minified, setMinified] = useState(false);

  const transform = useCallback(
    (input: string) => {
      if (minified && format === "json") return minifyJson(input);
      return formatData(input, format, 2);
    },
    [minified, format],
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
          downloadName={`formatted.${DATA_FORMAT_EXTENSIONS[format]}`}
          onClear={clear}
          onSave={save}
          extra={
            format === "json" ? (
              <Button
                variant={minified ? "primary" : "secondary"}
                onClick={() => setMinified((m) => !m)}
              >
                {minified ? "Minified" : "Minify"}
              </Button>
            ) : null
          }
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="Input"
          value={input}
          onChange={setInput}
          placeholder={`Paste ${format.toUpperCase()} here…`}
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
