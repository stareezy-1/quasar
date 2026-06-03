"use client";

/**
 * PugConverter — pug-to-html, jade-to-html, html-to-pug, html-to-jade.
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
import { pugToHtml, htmlToPug } from "@/lib/engines/html";

export default function PugConverter() {
  const tool = useToolMeta();
  const toHtml = useMemo(
    () => tool.id === "pug-to-html" || tool.id === "jade-to-html",
    [tool.id],
  );
  const isPug = useMemo(() => !tool.id.includes("jade"), [tool.id]);

  const transform = useCallback(
    (input: string) => (toHtml ? pugToHtml(input) : htmlToPug(input)),
    [toHtml],
  );

  const { input, setInput, output, error, clear, sessions, save, load } =
    useStandardTool({ toolId: tool.id, transform });

  const lang = isPug ? "PUG" : "JADE";

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
          downloadName={
            toHtml ? "output.html" : `output.${isPug ? "pug" : "jade"}`
          }
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label={toHtml ? lang : "HTML"}
          value={input}
          onChange={setInput}
          placeholder={
            toHtml
              ? "div.container\n  h1 Hello"
              : '<div class="container"><h1>Hello</h1></div>'
          }
        />
        <CodeEditor
          label={toHtml ? "HTML" : lang}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
