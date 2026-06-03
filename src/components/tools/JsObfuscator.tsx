"use client";

/**
 * JsObfuscator — basic JavaScript obfuscation (variable/function renaming,
 * string encoding, whitespace removal). Client-side only.
 */

import { useCallback } from "react";
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

function obfuscateJs(input: string): EngineResult<string> {
  if (!input.trim()) return err("Enter JavaScript code.");

  let out = input;

  // 1. Remove single-line comments
  out = out.replace(/\/\/[^\n]*/g, "");
  // 2. Remove multi-line comments
  out = out.replace(/\/\*[\s\S]*?\*\//g, "");
  // 3. Collapse whitespace
  out = out.replace(/\s+/g, " ").trim();

  // 4. Encode string literals as char codes
  out = out.replace(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g, (_m, d, s) => {
    const str: string = d ?? s ?? "";
    if (!str) return '""';
    const encoded = Array.from(str)
      .map(
        (c) =>
          `\\x${(c as string).charCodeAt(0).toString(16).padStart(2, "0")}`,
      )
      .join("");
    return `"${encoded}"`;
  });

  // 5. Rename local variables/functions with short names
  const reserved = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "return",
    "static",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "true",
    "false",
    "null",
    "undefined",
    "console",
    "window",
    "document",
    "Math",
    "JSON",
    "Object",
    "Array",
    "String",
    "Number",
    "Boolean",
    "Promise",
    "async",
    "await",
    "of",
    "from",
    "super",
    "arguments",
  ]);

  const identifiers = new Set<string>();
  const identRe = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
  let m: RegExpExecArray | null;
  while ((m = identRe.exec(out)) !== null) {
    if (!reserved.has(m[1]!)) identifiers.add(m[1]!);
  }

  const names = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
    "",
  );
  const nameMap = new Map<string, string>();
  let idx = 0;
  for (const id of identifiers) {
    if (idx < names.length) {
      nameMap.set(id, `_${names[idx++]}`);
    } else {
      nameMap.set(
        id,
        `_${Math.floor(idx++ / names.length)}${names[idx % names.length]}`,
      );
    }
  }

  out = out.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g, (match) => {
    if (reserved.has(match)) return match;
    return nameMap.get(match) ?? match;
  });

  return ok(out);
}

export default function JsObfuscator() {
  const tool = useToolMeta();

  const transform = useCallback((input: string) => obfuscateJs(input), []);

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
          downloadName="obfuscated.js"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="JavaScript Input"
          value={input}
          onChange={setInput}
          placeholder="function hello() { console.log('Hello, world!'); }"
        />
        <CodeEditor
          label="Obfuscated Output"
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
