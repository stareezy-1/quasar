"use client";

/**
 * CodeEditor — a monospace textarea with a label, line gutter feel via padding,
 * and a file-drop affordance. Kept dependency-free (no CodeMirror) so the bundle
 * stays small and offline-friendly; it still gives a solid editing experience.
 */

import { useRef, type ChangeEvent, type DragEvent } from "react";
import { readFileAsText } from "@/lib/utils/io";

export interface CodeEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  /** Accept file drops and load their text. */
  acceptDrop?: boolean;
}

export function CodeEditor({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  acceptDrop = true,
}: CodeEditorProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  async function handleDrop(e: DragEvent<HTMLDivElement>) {
    if (!acceptDrop || readOnly) return;
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        onChange(await readFileAsText(file));
      } catch {
        /* ignore unreadable files */
      }
    }
    dropRef.current?.removeAttribute("data-drag");
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.375rem",
        minWidth: 0,
      }}
    >
      <label
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--color-text-muted)",
        }}
      >
        {label}
      </label>
      <div
        ref={dropRef}
        onDragOver={(e) => {
          if (acceptDrop && !readOnly) {
            e.preventDefault();
            dropRef.current?.setAttribute("data-drag", "true");
          }
        }}
        onDragLeave={() => dropRef.current?.removeAttribute("data-drag")}
        onDrop={handleDrop}
        style={{ position: "relative", display: "flex" }}
      >
        <textarea
          className="mono"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: "340px",
            resize: "vertical",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            tabSize: 2,
            backgroundColor: readOnly
              ? "var(--color-surface)"
              : "var(--color-surface-elevated)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            padding: "0.875rem 1rem",
            whiteSpace: "pre",
            overflowWrap: "normal",
            overflowX: "auto",
          }}
        />
      </div>
    </div>
  );
}
