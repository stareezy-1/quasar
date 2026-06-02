/** ToolCard — a single tool tile linking to its page. */

import Link from "next/link";
import type { ToolMeta } from "@/types/tool";
import { ROUTES } from "@/constants/routes";
import { CATEGORIES } from "@/lib/registry/categories";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  const accent = CATEGORIES[tool.category].accent;
  return (
    <Link
      href={ROUTES.tool(tool.id)}
      className="card-hover"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "1rem",
        borderRadius: "0.75rem",
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
        minHeight: "120px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          aria-hidden="true"
          className="mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            borderRadius: "0.5rem",
            backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)`,
            color: accent,
            fontSize: "0.8125rem",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {tool.icon}
        </span>
        <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
          {tool.name}
        </span>
      </div>
      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.8125rem",
          lineHeight: 1.5,
        }}
      >
        {tool.description}
      </p>
    </Link>
  );
}
