"use client";

/** HtmlStripper — remove all HTML tags, returning plain text. */

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
import { ok } from "@/types/engines";
import { stripHtml } from "@/lib/engines/html";

export default function HtmlStripper() {
  const tool = useToolMeta();
  const transform = useCallback((input: string) => ok(stripHtml(input)), []);
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
          downloadName="stripped.txt"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="HTML"
          value={input}
          onChange={setInput}
          placeholder="<p>Hello <b>world</b></p>"
        />
        <CodeEditor
          label="Plain text"
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
