"use client";

/**
 * CaseConverter — pick a target case and transform the input live. The case
 * choice is local UI state (one tool, many cases).
 */

import { useCallback, useState } from "react";
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
import { ok } from "@/types/engines";
import {
  CASE_CONVERTERS,
  CASE_LABELS,
  type CaseKind,
} from "@/lib/engines/string";

const KINDS = Object.keys(CASE_CONVERTERS) as CaseKind[];

export default function CaseConverter() {
  const tool = useToolMeta();
  const [kind, setKind] = useState<CaseKind>("camel");

  const transform = useCallback(
    (input: string) => ok(CASE_CONVERTERS[kind](input)),
    [kind],
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
        {KINDS.map((k) => (
          <Button
            key={k}
            variant={kind === k ? "primary" : "secondary"}
            onClick={() => setKind(k)}
          >
            {CASE_LABELS[k]}
          </Button>
        ))}
      </div>
      <div className="tool-two-col">
        <CodeEditor
          label="Input"
          value={input}
          onChange={setInput}
          placeholder="Hello world example"
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
