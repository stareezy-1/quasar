"use client";

/**
 * SessionsPanel — a collapsible list of saved sessions for the current tool.
 * Lets the user load, rename, or delete a saved session. Local-only.
 */

import { useState } from "react";
import type { Session } from "@/types/sessions";
import { Button } from "@/components/tool-shell/Button";

export interface SessionsPanelProps {
  sessions: Session[];
  onLoad: (session: Session) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function SessionsPanel({
  sessions,
  onLoad,
  onDelete,
  onRename,
}: SessionsPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "0.5rem",
        backgroundColor: "var(--color-surface)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.625rem 1rem",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--color-text-secondary)",
          fontSize: "0.8125rem",
          fontWeight: 600,
        }}
      >
        <span>Saved sessions ({sessions.length})</span>
        <span aria-hidden="true">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid var(--color-border)" }}>
          {sessions.length === 0 ? (
            <p
              style={{
                padding: "0.75rem 1rem",
                color: "var(--color-text-muted)",
                fontSize: "0.8125rem",
              }}
            >
              No saved sessions yet. Use “Save” to keep one on this device.
            </p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <button
                  type="button"
                  onClick={() => onLoad(s)}
                  title="Load this session"
                  style={{
                    flex: "1 1 auto",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-primary)",
                    fontSize: "0.8125rem",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.name}
                  </span>
                </button>
                <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const name = window.prompt("Rename session", s.name);
                      if (name !== null) onRename(s.id, name);
                    }}
                  >
                    Rename
                  </Button>
                  <Button variant="ghost" onClick={() => onDelete(s.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
