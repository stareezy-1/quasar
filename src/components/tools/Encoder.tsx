"use client";

/**
 * Encoder — string ↔ hex / binary conversions. The tool id selects the
 * direction and representation.
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
import { type EngineResult, ok } from "@/types/engines";
import {
  stringToHex,
  hexToString,
  stringToBinary,
  binaryToString,
} from "@/lib/engines/string";

type Mode =
  | "string-to-hex"
  | "hex-to-string"
  | "string-to-binary"
  | "binary-to-string";

const TRANSFORMS: Record<Mode, (input: string) => EngineResult<string>> = {
  "string-to-hex": (i) => ok(stringToHex(i)),
  "hex-to-string": hexToString,
  "string-to-binary": (i) => ok(stringToBinary(i)),
  "binary-to-string": binaryToString,
};

const LABELS: Record<Mode, { in: string; out: string; ph: string }> = {
  "string-to-hex": { in: "Text", out: "Hex", ph: "Hello!" },
  "hex-to-string": { in: "Hex", out: "Text", ph: "48 65 6c 6c 6f 21" },
  "string-to-binary": { in: "Text", out: "Binary", ph: "Hi" },
  "binary-to-string": { in: "Binary", out: "Text", ph: "01001000 01101001" },
};

export default function Encoder() {
  const tool = useToolMeta();
  const mode = tool.id as Mode;
  const transform = useCallback(
    (input: string) => TRANSFORMS[mode](input),
    [mode],
  );
  const labels = useMemo(() => LABELS[mode], [mode]);

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
          label={labels.in}
          value={input}
          onChange={setInput}
          placeholder={labels.ph}
        />
        <CodeEditor
          label={labels.out}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
