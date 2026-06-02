"use client";

/**
 * ToolRenderer — given a tool id, lazily loads the registered component, wraps
 * it in a ToolProvider (so generic components can self-configure), and shows a
 * lightweight skeleton while loading.
 */

import { Suspense, lazy, useMemo } from "react";
import Link from "next/link";
import { getToolById } from "@/lib/registry";
import { CATEGORIES } from "@/lib/registry/categories";
import { ROUTES } from "@/constants/routes";
import { ToolProvider } from "@/components/tool-shell/ToolContext";

export function ToolRenderer({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId);

  const LazyTool = useMemo(() => {
    if (!tool) return null;
    return lazy(tool.load);
  }, [tool]);

  if (!tool || !LazyTool) {
    return (
      <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Tool not found.</p>
        <Link
          href={ROUTES.HOME}
          style={{ color: "var(--color-brand)", fontWeight: 600 }}
        >
          ← Back to all tools
        </Link>
      </div>
    );
  }

  const accent = CATEGORIES[tool.category].accent;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem" }}>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{ marginBottom: "1.25rem", fontSize: "0.8125rem" }}
      >
        <Link href={ROUTES.HOME} style={{ color: "var(--color-text-muted)" }}>
          Home
        </Link>
        <span style={{ color: "var(--color-text-muted)", margin: "0 0.4rem" }}>
          /
        </span>
        <Link href={ROUTES.TOOLS} style={{ color: accent, fontWeight: 600 }}>
          {CATEGORIES[tool.category].label}
        </Link>
        <span style={{ color: "var(--color-text-muted)", margin: "0 0.4rem" }}>
          /
        </span>
        <span style={{ color: "var(--color-text-secondary)" }}>
          {tool.name}
        </span>
      </nav>

      <ToolProvider tool={tool}>
        <Suspense fallback={<ToolSkeleton />}>
          <LazyTool />
        </Suspense>
      </ToolProvider>
    </div>
  );
}

function ToolSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          height: "2rem",
          width: "40%",
          borderRadius: "0.5rem",
          backgroundColor: "var(--color-surface)",
        }}
      />
      <div
        style={{
          height: "340px",
          borderRadius: "0.5rem",
          backgroundColor: "var(--color-surface)",
        }}
      />
    </div>
  );
}
