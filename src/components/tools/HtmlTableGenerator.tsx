"use client";

/**
 * HtmlTableGenerator — generate an HTML table from CSV/TSV data.
 */

import { useCallback } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import {
  ToolShell,
  ToolBar,
  StatsBar,
  SessionsPanel,
} from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useStandardTool } from "@/hooks";
import { generateHtmlTable } from "@/lib/engines/html";

export default function HtmlTableGenerator() {
  const tool = useToolMeta();

  const transform = useCallback(
    (input: string) => generateHtmlTable(input),
    [],
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
          downloadName="table.html"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="CSV / TSV Input"
          value={input}
          onChange={setInput}
          placeholder={"Name,Age,City\nAlice,30,London\nBob,25,Paris"}
        />
        <CodeEditor
          label="HTML Table"
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
