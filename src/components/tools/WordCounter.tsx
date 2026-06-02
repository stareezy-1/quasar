"use client";

/** WordCounter — live character/word/line/sentence/paragraph statistics. */

import { useMemo, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell } from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { analyzeText } from "@/lib/engines/string";

export default function WordCounter() {
  const tool = useToolMeta();
  const [input, setInput] = useState("");
  const stats = useMemo(() => analyzeText(input), [input]);

  const cards: { label: string; value: number }[] = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Chars (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Lines", value: stats.lines },
    { label: "Paragraphs", value: stats.paragraphs },
  ];

  return (
    <ToolShell title={tool.name} description={tool.description}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <span
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--color-brand)",
                lineHeight: 1,
              }}
            >
              {c.value}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
      <CodeEditor
        label="Text"
        value={input}
        onChange={setInput}
        placeholder="Paste or type text to analyze…"
      />
    </ToolShell>
  );
}
