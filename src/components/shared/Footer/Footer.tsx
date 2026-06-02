/**
 * Footer — branding, ecosystem links, categories. Server component.
 */

import Link from "next/link";
import {
  TOOL_COUNT,
  CATEGORIES,
  CATEGORY_ORDER,
  getToolsByCategory,
} from "@/lib/registry";
import { ROUTES } from "@/constants/routes";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
        marginTop: "4rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 1.5rem 2rem",
        }}
      >
        {/* Top grid: brand + category columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr repeat(3, 1fr)",
            gap: "2rem",
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid var(--color-border)",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, var(--color-brand), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Quasar
              </span>
            </div>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.8125rem",
                lineHeight: 1.65,
                maxWidth: "280px",
              }}
            >
              {TOOL_COUNT}+ privacy-first developer tools. Everything runs in
              your browser — no upload, no account, works offline.
            </p>
            {/* Privacy badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.875rem",
                borderRadius: "0.5rem",
                backgroundColor:
                  "color-mix(in srgb, var(--color-brand) 8%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--color-brand) 20%, transparent)",
                width: "fit-content",
              }}
            >
              <span aria-hidden="true">🛡</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-brand)",
                  fontWeight: 600,
                }}
              >
                Zero uploads · 100% local
              </span>
            </div>
          </div>

          {/* Tool category columns — show first 3 categories */}
          {CATEGORY_ORDER.slice(0, 3).map((cat) => {
            const meta = CATEGORIES[cat];
            const tools = getToolsByCategory(cat).slice(0, 6);
            return (
              <nav
                key={cat}
                aria-label={`${meta.label} tools`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: meta.accent,
                    margin: 0,
                  }}
                >
                  {meta.label}
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                  }}
                >
                  {tools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={ROUTES.tool(tool.id)}
                        style={{
                          color: "var(--color-text-secondary)",
                          fontSize: "0.8125rem",
                        }}
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.8125rem",
              margin: 0,
            }}
          >
            © {year} Quasar · Part of the Stareezy ecosystem
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {/* UI by stareezy-ui */}
            <a
              href="https://ui.stareezy.tech"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.8125rem",
                color: "var(--color-text-muted)",
              }}
            >
              UI by{" "}
              <span style={{ color: "var(--color-brand)", fontWeight: 700 }}>
                @stareezy-ui
              </span>{" "}
              ↗
            </a>

            <a
              href="https://aurora.stareezy.tech"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.8125rem",
              }}
            >
              Aurora PDF ↗
            </a>

            <a
              href="https://stareezy.tech"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.35rem 0.7rem",
                borderRadius: "0.4rem",
                border:
                  "1px solid color-mix(in srgb, var(--color-brand) 30%, transparent)",
                backgroundColor:
                  "color-mix(in srgb, var(--color-brand) 8%, transparent)",
                color: "var(--color-brand)",
                fontSize: "0.8125rem",
                fontWeight: 700,
              }}
            >
              🌐 stareezy.tech ↗
            </a>

            <a
              href="/faq"
              style={{
                color: "var(--color-text-muted)",
                fontSize: "0.8125rem",
              }}
            >
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
