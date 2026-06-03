"use client";

/**
 * TextRepeater — repeat text or words N times.
 * Handles: text-repeater, word-repeater, random-word-generator, string-builder,
 * delimited-text-extractor.
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
import { ok, err, type EngineResult } from "@/types/engines";
import { repeatText, sortWords } from "@/lib/engines/string";
import type { Session } from "@/types/sessions";

// ── Random word list ────────────────────────────────────────────────────────
const WORD_LIST = [
  "ability",
  "above",
  "absent",
  "achieve",
  "action",
  "active",
  "actual",
  "adapt",
  "address",
  "afford",
  "afraid",
  "agree",
  "ahead",
  "alert",
  "almost",
  "alone",
  "along",
  "alter",
  "angel",
  "animal",
  "answer",
  "appear",
  "apply",
  "argue",
  "arise",
  "array",
  "aside",
  "asked",
  "asset",
  "assign",
  "basic",
  "begin",
  "below",
  "brain",
  "brave",
  "break",
  "bring",
  "broad",
  "build",
  "burst",
  "cabin",
  "carry",
  "catch",
  "cause",
  "chain",
  "chair",
  "chalk",
  "chess",
  "child",
  "claim",
  "clean",
  "clear",
  "climb",
  "close",
  "cloud",
  "coast",
  "color",
  "coral",
  "count",
  "cover",
  "crash",
  "cross",
  "curve",
  "cycle",
  "daily",
  "dance",
  "debut",
  "depth",
  "devil",
  "digit",
  "drama",
  "drink",
  "drive",
  "early",
  "earth",
  "empty",
  "enter",
  "equal",
  "error",
  "event",
  "every",
  "exist",
  "extra",
  "fable",
  "faith",
  "false",
  "fame",
  "fancy",
  "field",
  "final",
  "first",
  "fixed",
  "flame",
  "flash",
  "float",
  "floor",
  "flush",
  "focus",
  "force",
  "forge",
  "frame",
  "fresh",
  "front",
  "fruit",
  "fully",
  "given",
  "glass",
  "globe",
  "grace",
  "grade",
  "grain",
  "grant",
  "grasp",
  "great",
  "green",
  "greet",
  "group",
  "grow",
  "guard",
  "guide",
  "habit",
  "happy",
  "heard",
  "heart",
  "heavy",
  "horse",
  "house",
  "human",
  "hydro",
  "ideal",
  "image",
  "imply",
  "index",
  "input",
  "issue",
  "judge",
  "juice",
  "judge",
  "light",
  "limit",
  "logic",
  "loose",
  "lower",
  "lucky",
  "magic",
  "major",
  "maker",
  "match",
  "might",
  "minor",
  "money",
  "month",
  "moral",
  "mount",
  "music",
  "nerve",
  "never",
  "night",
  "noble",
  "north",
  "novel",
  "ocean",
  "offer",
  "often",
  "order",
  "other",
  "outer",
  "paint",
  "paper",
  "party",
  "peace",
  "phase",
  "phone",
  "pilot",
  "pixel",
  "place",
  "plain",
  "plant",
  "plate",
  "plaza",
  "power",
  "press",
  "price",
  "prime",
  "print",
  "prior",
  "prize",
  "probe",
  "proof",
  "proud",
  "prove",
  "quick",
  "quiet",
  "quote",
  "radio",
  "raise",
  "rapid",
  "reach",
  "ready",
  "realm",
  "right",
  "river",
  "robot",
  "round",
  "route",
  "royal",
  "rural",
  "scale",
  "scene",
  "scope",
  "score",
  "sense",
  "serve",
  "sharp",
  "shift",
  "shore",
  "short",
  "shown",
  "sight",
  "smart",
  "smile",
  "solid",
  "solve",
  "south",
  "space",
  "spark",
  "speak",
  "speed",
  "spell",
  "spend",
  "split",
  "stage",
  "stand",
  "start",
  "state",
  "steel",
  "stern",
  "store",
  "storm",
  "story",
  "style",
  "super",
  "swift",
  "table",
  "teach",
  "tense",
  "terms",
  "theme",
  "thing",
  "think",
  "throw",
  "tight",
  "timer",
  "title",
  "today",
  "token",
  "total",
  "touch",
  "tough",
  "tower",
  "trace",
  "track",
  "trade",
  "train",
  "treat",
  "trend",
  "trial",
  "truck",
  "trust",
  "truth",
  "under",
  "unity",
  "until",
  "upper",
  "usual",
  "valid",
  "value",
  "video",
  "vigor",
  "vital",
  "voice",
  "waste",
  "water",
  "width",
  "world",
  "worth",
  "write",
  "young",
  "yours",
  "zones",
];

function generateRandomWords(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]!);
  }
  return result.join(" ");
}

function extractDelimited(
  input: string,
  delimiter: string,
  position: number,
): EngineResult<string> {
  if (!input.trim()) return err("Enter text to extract from.");
  const lines = input.split("\n");
  const results = lines.map((line) => {
    const parts = line.split(delimiter);
    const idx = position < 0 ? parts.length + position : position - 1;
    return parts[idx] ?? "";
  });
  return ok(results.join("\n"));
}

export default function TextRepeater() {
  const tool = useToolMeta();
  const [count, setCount] = useState("5");
  const [separator, setSeparator] = useState("\\n");
  const [delimiter, setDelimiter] = useState(",");
  const [position, setPosition] = useState("1");
  const [randomOutput, setRandomOutput] = useState("");

  const isWordRepeater = tool.id === "word-repeater";
  const isRandom = tool.id === "random-word-generator";
  const isExtract = tool.id === "delimited-text-extractor";
  const isBuilder = tool.id === "string-builder";

  const transform = useCallback(
    (input: string): EngineResult<string> => {
      const n = parseInt(count, 10) || 1;
      if (isExtract)
        return extractDelimited(input, delimiter, parseInt(position, 10) || 1);
      if (isWordRepeater) {
        const words = input.trim().split(/\s+/).filter(Boolean);
        const sep = separator.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        const repeated = words.flatMap((w) => Array(n).fill(w)).join(sep);
        return ok(repeated);
      }
      if (isBuilder) return ok(input);
      const sep = separator.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
      return ok(
        repeatText(input, n)
          .split("")
          .join("")
          .replace(new RegExp(`(.{${input.length}})`, "g"), "$1" + sep)
          .trimEnd(),
      );
    },
    [
      count,
      separator,
      delimiter,
      position,
      isWordRepeater,
      isExtract,
      isBuilder,
    ],
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

  const genRandom = useCallback(() => {
    const n = parseInt(count, 10) || 5;
    setRandomOutput(generateRandomWords(Math.min(n, 500)));
  }, [count]);

  if (isRandom) {
    return (
      <ToolShell
        title={tool.name}
        description={tool.description}
        error={null}
        toolbar={
          <ToolBar
            output={randomOutput}
            downloadName="words.txt"
            onClear={() => setRandomOutput("")}
          />
        }
        stats={<StatsBar value={randomOutput} />}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "480px",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              Word count
            </span>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="500"
              className="mono"
            />
          </label>
          <button className="btn btn-primary" onClick={genRandom}>
            Generate
          </button>
          {randomOutput && (
            <CodeEditor
              label="Random Words"
              value={randomOutput}
              onChange={setRandomOutput}
              readOnly={false}
            />
          )}
        </div>
      </ToolShell>
    );
  }

  const extraControls = (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      {!isExtract && (
        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
            }}
          >
            {isWordRepeater ? "Repeat each word" : "Repeat count"}
          </span>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            className="mono"
            style={{ width: "80px" }}
          />
        </label>
      )}
      {!isExtract && (
        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
            }}
          >
            Separator (\\n=newline)
          </span>
          <input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="mono"
            style={{ width: "120px" }}
          />
        </label>
      )}
      {isExtract && (
        <>
          <label
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
              }}
            >
              Delimiter
            </span>
            <input
              type="text"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="mono"
              style={{ width: "60px" }}
            />
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-secondary)",
              }}
            >
              Column #
            </span>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mono"
              style={{ width: "80px" }}
            />
          </label>
        </>
      )}
    </div>
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
          extra={extraControls}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="Input"
          value={state.input}
          onChange={state.setInput}
          placeholder="Enter text…"
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
