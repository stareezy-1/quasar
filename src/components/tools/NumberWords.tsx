"use client";

/**
 * NumberWords — convert numbers to English words and vice versa.
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
import { numberToWords, wordsToNumber } from "@/lib/engines/string";

export default function NumberWords() {
  const tool = useToolMeta();
  const toWords = useMemo(() => tool.id === "number-to-word", [tool.id]);

  const transform = useCallback(
    (input: string) => (toWords ? numberToWords(input) : wordsToNumber(input)),
    [toWords],
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
          label={toWords ? "Number" : "Words"}
          value={input}
          onChange={setInput}
          placeholder={toWords ? "42" : "forty-two"}
        />
        <CodeEditor
          label={toWords ? "Words" : "Number"}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
