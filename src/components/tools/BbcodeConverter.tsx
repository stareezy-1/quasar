"use client";

/**
 * BbcodeConverter — bbcode-to-html and html-to-bbcode.
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
import { bbcodeToHtml, htmlToBbcode } from "@/lib/engines/html";

export default function BbcodeConverter() {
  const tool = useToolMeta();
  const toHtml = useMemo(() => tool.id === "bbcode-to-html", [tool.id]);

  const transform = useCallback(
    (input: string) => (toHtml ? bbcodeToHtml(input) : htmlToBbcode(input)),
    [toHtml],
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
          downloadName={toHtml ? "output.html" : "output.bb"}
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label={toHtml ? "BBCode" : "HTML"}
          value={input}
          onChange={setInput}
          placeholder={toHtml ? "[b]Hello[/b]" : "<b>Hello</b>"}
        />
        <CodeEditor
          label={toHtml ? "HTML" : "BBCode"}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
