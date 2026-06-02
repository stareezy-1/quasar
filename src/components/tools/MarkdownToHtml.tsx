"use client";

/** MarkdownToHtml — convert Markdown source to HTML. */

import { useToolMeta } from "@/components/tool-shell/ToolContext";
import {
  ToolShell,
  ToolBar,
  StatsBar,
  SessionsPanel,
} from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useStandardTool } from "@/hooks";
import { markdownToHtml } from "@/lib/engines/html";

export default function MarkdownToHtml() {
  const tool = useToolMeta();
  const { input, setInput, output, error, clear, sessions, save, load } =
    useStandardTool({ toolId: tool.id, transform: markdownToHtml });

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
          downloadName="output.html"
          downloadMime="text/html"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="Markdown"
          value={input}
          onChange={setInput}
          placeholder="# Hello&#10;**bold** and *italic*"
        />
        <CodeEditor label="HTML" value={output} onChange={() => {}} readOnly />
      </div>
    </ToolShell>
  );
}
