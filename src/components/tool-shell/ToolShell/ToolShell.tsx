/**
 * ToolShell - the consistent layout wrapper for every tool. Renders the title,
 * description, an optional toolbar, the tool body (children), an error banner,
 * optional stats, and an optional sessions panel.
 *
 * Tools stay tiny because all chrome lives here.
 */

import type { ReactNode } from "react";
import { ErrorBanner } from "@/components/tool-shell/ErrorBanner";

export interface ToolShellProps {
  title: string;
  description: string;
  toolbar?: ReactNode;
  error?: string | null;
  stats?: ReactNode;
  sessions?: ReactNode;
  children: ReactNode;
}

export function ToolShell({
  title,
  description,
  toolbar,
  error,
  stats,
  sessions,
  children,
}: ToolShellProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header
        style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
      >
        <h1
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "0.9375rem",
          }}
        >
          {description}
        </p>
      </header>

      {toolbar && <div>{toolbar}</div>}

      {children}

      {stats && <div>{stats}</div>}

      <ErrorBanner message={error ?? null} />

      {sessions && <div>{sessions}</div>}
    </div>
  );
}
