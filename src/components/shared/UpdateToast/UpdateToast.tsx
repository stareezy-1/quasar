"use client";

/**
 * UpdateToast — listens for the "sw-update-ready" event dispatched by
 * register-sw.js and prompts the user to reload for the new version.
 */

import { useEffect, useState } from "react";

export function UpdateToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("sw-update-ready", handler);
    return () => window.removeEventListener("sw-update-ready", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.75rem",
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface-elevated)",
        boxShadow:
          "0 8px 32px color-mix(in srgb, var(--color-background) 60%, transparent)",
        fontSize: "0.875rem",
        maxWidth: "320px",
      }}
    >
      <span style={{ color: "var(--color-text-secondary)" }}>
        A new version is available.
      </span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          padding: "0.375rem 0.75rem",
          borderRadius: "0.5rem",
          backgroundColor: "var(--color-brand)",
          color: "var(--color-background)",
          border: "none",
          fontWeight: 700,
          fontSize: "0.8125rem",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Update
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setVisible(false)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--color-text-muted)",
          fontSize: "1rem",
          padding: "0.125rem",
        }}
      >
        ✕
      </button>
    </div>
  );
}
