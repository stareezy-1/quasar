"use client";

/**
 * JsonStringify — JSON stringify (escape for embedding in code) and
 * JSON deserialize (unescape a JSON string literal back to pretty JSON).
 * Also handles: json-serialize, string-to-json.
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
import { ok, err, type EngineResult } from "@/types/engines";
import { parseJson, formatJson } from "@/lib/engines/data/json";

function jsonStringify(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  // Parse first to validate, then produce the escaped string literal
  const parsed = parseJson(input);
  if (!parsed.ok) {
    // If it's not valid JSON, stringify the raw string
    return ok(JSON.stringify(input));
  }
  return ok(JSON.stringify(JSON.stringify(parsed.value)));
}

function jsonDeserialize(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  try {
    // Input is a JSON string literal (quoted, escaped) — parse it once to get
    // the inner string, then parse again to get the object and format it.
    const unescaped = JSON.parse(input);
    if (typeof unescaped === "string") {
      return formatJson(unescaped, 2);
    }
    // Already an object — just format it
    return ok(JSON.stringify(unescaped, null, 2));
  } catch {
    return err(
      "Invalid input. Paste a JSON string literal (with outer quotes).",
    );
  }
}

function stringToJson(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  // Try parsing as JSON first
  const direct = parseJson(input);
  if (direct.ok) return ok(JSON.stringify(direct.value, null, 2));
  // Try treating it as a raw string and build a JSON value
  return ok(JSON.stringify(input));
}

export default function JsonStringify() {
  const tool = useToolMeta();

  const transform = useCallback(
    (input: string): EngineResult<string> => {
      switch (tool.id) {
        case "json-stringify":
        case "json-serialize":
          return jsonStringify(input);
        case "json-deserialize":
          return jsonDeserialize(input);
        case "string-to-json":
          return stringToJson(input);
        default:
          return jsonDeserialize(input);
      }
    },
    [tool.id],
  );

  const placeholder = useMemo(() => {
    switch (tool.id) {
      case "json-stringify":
      case "json-serialize":
        return '{"key": "value"}';
      case "json-deserialize":
        return '"{\\"key\\": \\"value\\"}"';
      case "string-to-json":
        return "Hello, world!";
      default:
        return "";
    }
  }, [tool.id]);

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
          downloadName="output.json"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="Input"
          value={input}
          onChange={setInput}
          placeholder={placeholder}
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
