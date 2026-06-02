"use client";

/** WordFrequency — count and rank how often each word appears. */

import { useCallback } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, ToolBar, SessionsPanel } from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useStandardTool } from "@/hooks";
import { ok } from "@/types/engines";
import { wordFrequency } from "@/lib/engines/string";

export default function WordFrequency() {
  const tool = useToolMeta();

  const transform = useCallback((input: string) => {
    const freqs = wordFrequency(input);
    const text = freqs.map((f) => `${f.count}\t${f.word}`).join("\n");
    return ok(text);
  }, []);

  const { input, setInput, output, error, clear, sessions, save, load } =
    useStandardTool({ toolId: tool.id, transform });

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={error}
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
          downloadName="word-frequency.tsv"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="Text"
          value={input}
          onChange={setInput}
          placeholder="Paste text…"
        />
        <CodeEditor
          label="Count    Word"
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
