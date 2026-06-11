"use client";

/**
 * ColorConverter - single component powering all 23 color converters. It reads
 * the from/to formats from the tool id ("{from}-to-{to}"), renders a single
 * input plus a live swatch, and shows the converted value.
 */

import { useCallback, useMemo } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, ToolBar, SessionsPanel } from "@/components/tool-shell";
import { useStandardTool } from "@/hooks";
import {
  convertColor,
  parseColor,
  rgbToHex,
  type ColorFormat,
  COLOR_FORMAT_LABELS,
} from "@/lib/engines/color";

function parsePair(id: string): { from: ColorFormat; to: ColorFormat } {
  const [from, , to] = id.split("-");
  return {
    from: (from ?? "hex") as ColorFormat,
    to: (to ?? "rgb") as ColorFormat,
  };
}

const PLACEHOLDERS: Record<ColorFormat, string> = {
  hex: "#00ff88",
  rgb: "0, 255, 136",
  hsl: "152, 100%, 50%",
  hsv: "152, 100%, 100%",
  cmyk: "100%, 0%, 47%, 0%",
  colortone: "teal",
};

export default function ColorConverter() {
  const tool = useToolMeta();
  const { from, to } = useMemo(() => parsePair(tool.id), [tool.id]);

  const transform = useCallback(
    (input: string) => convertColor(input, from, to),
    [from, to],
  );

  const { input, setInput, output, error, clear, sessions, save, load } =
    useStandardTool({ toolId: tool.id, transform });

  // Live swatch from the parsed input (independent of target format).
  const swatch = useMemo(() => {
    const rgb = parseColor(input, from);
    return rgb ? rgbToHex(rgb) : null;
  }, [input, from]);

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
          downloadName="color.txt"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "560px",
        }}
      >
        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            {COLOR_FORMAT_LABELS[from]} input
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDERS[from]}
            className="mono"
          />
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            aria-label="Color preview"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "0.75rem",
              border: "1px solid var(--color-border)",
              backgroundColor: swatch ?? "transparent",
              backgroundImage: swatch
                ? "none"
                : "repeating-conic-gradient(var(--color-border) 0% 25%, transparent 0% 50%)",
              backgroundSize: "16px 16px",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              {COLOR_FORMAT_LABELS[to]} output
            </span>
            <span
              className="mono"
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-brand)",
              }}
            >
              {output || "..."}
            </span>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
