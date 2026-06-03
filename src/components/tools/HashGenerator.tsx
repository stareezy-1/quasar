"use client";

/**
 * HashGenerator — MD5 and NTLM hash generators.
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
import { md5Hash, ntlmHash } from "@/lib/engines/string";

export default function HashGenerator() {
  const tool = useToolMeta();

  const transform = useCallback(
    (input: string) =>
      tool.id === "ntlm-hash" ? ntlmHash(input) : md5Hash(input),
    [tool.id],
  );

  const label = useMemo(
    () => (tool.id === "ntlm-hash" ? "NTLM Hash" : "MD5 Hash"),
    [tool.id],
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
          downloadName="hash.txt"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="Input Text"
          value={input}
          onChange={setInput}
          placeholder="Enter text to hash…"
        />
        <CodeEditor label={label} value={output} onChange={() => {}} readOnly />
      </div>
    </ToolShell>
  );
}
