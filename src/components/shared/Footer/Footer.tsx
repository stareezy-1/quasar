/**
 * Footer — branding, ecosystem links, and a privacy note. Server component.
 */

import { TOOL_COUNT } from "@/lib/registry";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
        padding: "2.5rem 1.5rem",
        marginTop: "4rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            maxWidth: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: "1.125rem" }}>Quasar</span>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            {TOOL_COUNT}+ privacy-first developer tools. Everything runs in your
            browser — no upload, no account, works offline.
          </p>
        </div>

        <nav
          aria-label="Ecosystem"
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-text-muted)",
            }}
          >
            Stareezy
          </span>
          <a
            href="https://ui.stareezy.tech"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            @stareezy-ui ↗
          </a>
          <a
            href="https://aurora.stareezy.tech"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
            }}
          >
            Aurora PDF ↗
          </a>
        </nav>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "1.5rem auto 0",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "1rem",
        }}
      >
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>
          © {year} Quasar — part of the Stareezy ecosystem. Built with Next.js
          &amp; React.
        </p>
      </div>
    </footer>
  );
}
