"use client";

/**
 * HtmlEntities — encode/decode HTML entities. Direction is chosen by the tool
 * id: "text-to-html-entities" encodes, "html-entities-to-text" decodes.
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
import { ok } from "@/types/engines";
import { encodeHtmlEntities, decodeHtmlEntities } from "@/lib/engines/html";

export default function HtmlEntities() {
  const tool = useToolMeta();
  const decode = useMemo(() => tool.id.startsWith("html-entities"), [tool.id]);

  const transform = useCallback(
    (input: string) =>
      ok(decode ? decodeHtmlEntities(input) : encodeHtmlEntities(input)),
    [decode],
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
          downloadName="output.txt"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label={decode ? "Entities" : "Text"}
          value={input}
          onChange={setInput}
          placeholder={decode ? "&lt;div&gt;" : "<div>"}
        />
        <CodeEditor
          label={decode ? "Text" : "Entities"}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
