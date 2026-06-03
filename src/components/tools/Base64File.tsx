"use client";

/**
 * Base64File — encode/decode binary files (JSON, XML, YAML, CSV, TSV, hex, octal, binary)
 * to/from Base64. Direction + format derived from tool id (e.g. "json-to-base64").
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
import { useStandardTool } from "@/hooks";
import { ok, err, type EngineResult } from "@/types/engines";
import { encodeBase64, decodeBase64 } from "@/lib/engines/string";

function detectDirection(id: string): "encode" | "decode" {
  return id.endsWith("-to-base64") ? "encode" : "decode";
}

function hexToBase64(input: string): EngineResult<string> {
  const cleaned = input.replace(/\s/g, "");
  if (!/^[0-9a-fA-F]*$/.test(cleaned)) return err("Invalid hex input.");
  try {
    const bytes = cleaned.match(/.{2}/g)?.map((b) => parseInt(b, 16)) ?? [];
    const binary = bytes.map((b) => String.fromCharCode(b)).join("");
    return ok(btoa(binary));
  } catch {
    return err("Conversion failed.");
  }
}

function base64ToHex(input: string): EngineResult<string> {
  try {
    const binary = atob(input.trim());
    return ok(
      Array.from(binary)
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(" "),
    );
  } catch {
    return err("Invalid Base64.");
  }
}

function octalToBase64(input: string): EngineResult<string> {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  if (parts.some((p) => !/^[0-7]+$/.test(p)))
    return err("Invalid octal input.");
  try {
    const binary = parts
      .map((p) => String.fromCharCode(parseInt(p, 8)))
      .join("");
    return ok(btoa(binary));
  } catch {
    return err("Conversion failed.");
  }
}

function base64ToBinary(input: string): EngineResult<string> {
  try {
    const binary = atob(input.trim());
    return ok(
      Array.from(binary)
        .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
        .join(" "),
    );
  } catch {
    return err("Invalid Base64.");
  }
}

function binaryToBase64(input: string): EngineResult<string> {
  const groups = input.trim().split(/\s+/).filter(Boolean);
  if (groups.some((g) => !/^[01]{1,8}$/.test(g)))
    return err("Invalid binary input.");
  try {
    const binary = groups
      .map((g) => String.fromCharCode(parseInt(g, 2)))
      .join("");
    return ok(btoa(binary));
  } catch {
    return err("Conversion failed.");
  }
}

export default function Base64File() {
  const tool = useToolMeta();
  const direction = useMemo(() => detectDirection(tool.id), [tool.id]);

  const transform = useCallback(
    (input: string): EngineResult<string> => {
      const id = tool.id;
      // Encode direction
      if (id.endsWith("-to-base64")) {
        if (id.startsWith("hex")) return hexToBase64(input);
        if (id.startsWith("octal")) return octalToBase64(input);
        if (id.startsWith("binary")) return binaryToBase64(input);
        // json, xml, yaml, csv, tsv — treat as text
        return ok(encodeBase64(input));
      }
      // Decode direction
      if (id.startsWith("base64-to-hex")) return base64ToHex(input);
      if (id.startsWith("base64-to-binary")) return base64ToBinary(input);
      return decodeBase64(input);
    },
    [tool.id],
  );

  const fromLabel = useMemo(() => {
    if (direction === "encode") {
      const [f] = tool.id.split("-to-");
      return (f ?? "Input").toUpperCase();
    }
    return "Base64";
  }, [direction, tool.id]);

  const toLabel = useMemo(() => {
    if (direction === "decode") {
      const parts = tool.id.split("-to-");
      return (parts[1] ?? "Output").toUpperCase();
    }
    return "Base64";
  }, [direction, tool.id]);

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
          label={fromLabel}
          value={input}
          onChange={setInput}
          placeholder={direction === "encode" ? "Paste content…" : "SGVsbG8h"}
        />
        <CodeEditor
          label={toLabel}
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
