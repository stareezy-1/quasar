"use client";

/**
 * Base64 — encode or decode text. Direction from tool id:
 * "text-to-base64" encodes, "base64-to-text" decodes.
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
import { encodeBase64, decodeBase64 } from "@/lib/engines/string";

export default function Base64() {
  const tool = useToolMeta();
  const decode = useMemo(() => tool.id.startsWith("base64-to"), [tool.id]);

  const transform = useCallback(
    (input: string) => (decode ? decodeBase64(input) : ok(encodeBase64(input))),
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
          label={decode ? "Base64" : "Text"}
          value={input}
          onChange={setInput}
          placeholder={decode ? "SGVsbG8h" : "Hello!"}
        />
        <CodeEditor
          label={decode ? "Text" : "Base64"}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
