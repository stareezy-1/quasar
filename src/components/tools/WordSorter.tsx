"use client";

/**
 * WordSorter — sort words alphabetically, with ascending/descending toggle.
 * Also handles remove-accents (reuses TextTransform pattern but needs a separate
 * component for the sort direction toggle).
 */

import { useCallback, useState } from "react";
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
import { sortWords, removeAccents } from "@/lib/engines/string";
import { Button } from "@/components/tool-shell";
import type { Session } from "@/types/sessions";

export default function WordSorter() {
  const tool = useToolMeta();
  const [descending, setDescending] = useState(false);
  const isAccents = tool.id === "remove-accents";

  const transform = useCallback(
    (input: string) => {
      if (isAccents) return ok(removeAccents(input));
      return ok(sortWords(input, descending));
    },
    [isAccents, descending],
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
            !isAccents ? (
              <Button
                variant={descending ? "primary" : "secondary"}
                onClick={() => setDescending((d) => !d)}
              >
                {descending ? "Z → A" : "A → Z"}
              </Button>
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
          placeholder="apple banana cherry"
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
