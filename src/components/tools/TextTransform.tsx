"use client";

/**
 * TextTransform — single component for the line/text cleanup tools. The tool id
 * selects the transform. "remove-lines-containing" gets an extra needle input.
 */

import { useCallback, useMemo, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import {
  ToolShell,
  ToolBar,
  StatsBar,
  SessionsPanel,
} from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useToolState, useSessions } from "@/hooks";
import { ok } from "@/types/engines";
import type { Session } from "@/types/sessions";
import {
  reverseString,
  upsideDown,
  removeDuplicateLines,
  removeEmptyLines,
  removeExtraSpaces,
  removeWhitespace,
  removeLineBreaks,
  removeLinesContaining,
  removePunctuation,
  sortLines,
} from "@/lib/engines/string";

type Transformer = (input: string, arg: string) => string;

const TRANSFORMS: Record<string, Transformer> = {
  "reverse-string": (i) => reverseString(i),
  "upside-down-text": (i) => upsideDown(i),
  "remove-duplicate-lines": (i) => removeDuplicateLines(i),
  "remove-empty-lines": (i) => removeEmptyLines(i),
  "remove-extra-spaces": (i) => removeExtraSpaces(i),
  "remove-whitespace": (i) => removeWhitespace(i),
  "remove-line-breaks": (i) => removeLineBreaks(i),
  "remove-punctuation": (i) => removePunctuation(i),
  "sort-text-lines": (i) => sortLines(i),
  "remove-lines-containing": (i, arg) => removeLinesContaining(i, arg),
};

export default function TextTransform() {
  const tool = useToolMeta();
  const [needle, setNeedle] = useState("");
  const needsArg = tool.id === "remove-lines-containing";

  const transform = useCallback(
    (input: string) => {
      const fn = TRANSFORMS[tool.id] ?? ((i: string) => i);
      return ok(fn(input, needle));
    },
    [tool.id, needle],
  );

  const state = useToolState({ toolId: tool.id, transform });
  const sessions = useSessions(tool.id);

  const save = useCallback(() => {
    const name = window.prompt("Name this session");
    if (name === null) return;
    sessions.save(name, { input: state.input });
  }, [sessions, state.input]);

  const load = useCallback(
    (s: Session) => state.setInput(s.inputs.input ?? ""),
    [state],
  );

  const placeholder = useMemo(
    () =>
      tool.id === "sort-text-lines" ? "banana\napple\ncherry" : "Paste text…",
    [tool.id],
  );

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={state.error}
      stats={<StatsBar value={state.output} />}
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
          output={state.output}
          downloadName="output.txt"
          onClear={state.clear}
          onSave={save}
          extra={
            needsArg ? (
              <input
                type="text"
                value={needle}
                onChange={(e) => setNeedle(e.target.value)}
                placeholder="Text to match"
                style={{ maxWidth: "200px" }}
              />
            ) : null
          }
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="Input"
          value={state.input}
          onChange={state.setInput}
          placeholder={placeholder}
        />
        <CodeEditor
          label="Output"
          value={state.output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
