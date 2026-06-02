"use client";

/**
 * ToolBar — the standard row of actions every tool shares: copy output,
 * download, clear input, and save a session. Tools can pass extra controls via
 * `extra` (rendered on the left).
 */

import { useState, type ReactNode } from "react";
import { Button } from "@/components/tool-shell/Button";
import { copyToClipboard, downloadText } from "@/lib/utils/io";

export interface ToolBarProps {
  /** Output text used for copy + download. */
  output: string;
  /** Suggested download filename. */
  downloadName?: string;
  /** MIME type for download. */
  downloadMime?: string;
  /** Clear handler — typically clears the input. */
  onClear?: () => void;
  /** Save handler — receives nothing; the tool snapshots its own state. */
  onSave?: () => void;
  /** Extra controls rendered at the start of the bar. */
  extra?: ReactNode;
}

export function ToolBar({
  output,
  downloadName = "quasar-output.txt",
  downloadMime = "text/plain",
  onClear,
  onSave,
  extra,
}: ToolBarProps) {
  const [copied, setCopied] = useState(false);
  const hasOutput = output.trim() !== "";

  async function handleCopy() {
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5rem",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        {extra}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {onClear && (
          <Button variant="ghost" onClick={onClear}>
            Clear
          </Button>
        )}
        {onSave && (
          <Button variant="ghost" onClick={onSave}>
            ＋ Save
          </Button>
        )}
        <Button onClick={handleCopy} disabled={!hasOutput}>
          {copied ? "✓ Copied" : "Copy"}
        </Button>
        <Button
          variant="primary"
          onClick={() => downloadText(downloadName, output, downloadMime)}
          disabled={!hasOutput}
        >
          Download
        </Button>
      </div>
    </div>
  );
}
