"use client";

/**
 * ToolExplorer — client-side search + category filtering over the registry.
 * Used on both the home page and the /tools page.
 */

import { useMemo, useState } from "react";
import { TOOLS, searchTools, CATEGORY_ORDER, CATEGORIES } from "@/lib/registry";
import type { ToolCategory } from "@/types/tool";
import { ToolCard } from "./ToolCard";

export function ToolExplorer() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">(
    "all",
  );

  const results = useMemo(() => {
    const base = query.trim() ? searchTools(query) : TOOLS;
    return activeCategory === "all"
      ? base
      : base.filter((t) => t.category === activeCategory);
  }, [query, activeCategory]);

  const pill = (active: boolean, accent?: string) => ({
    padding: "0.4rem 0.8rem",
    borderRadius: "9999px",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid var(--color-border)",
    backgroundColor: active
      ? accent ?? "var(--color-brand)"
      : "var(--color-surface-elevated)",
    color: active ? "var(--color-background)" : "var(--color-text-secondary)",
    whiteSpace: "nowrap" as const,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${TOOLS.length}+ tools…`}
        aria-label="Search tools"
        style={{ fontSize: "1rem", padding: "0.75rem 1rem" }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          style={pill(activeCategory === "all")}
        >
          All
        </button>
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            style={pill(activeCategory === cat, CATEGORIES[cat].accent)}
          >
            {CATEGORIES[cat].label}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <p style={{ color: "var(--color-text-muted)" }}>
          No tools match “{query}”.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "0.875rem",
          }}
        >
          {results.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
