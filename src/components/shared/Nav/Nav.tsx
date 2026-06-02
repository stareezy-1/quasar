"use client";

/**
 * Nav — top app bar with the Quasar wordmark, a link to all tools, and the
 * theme control. Kept lightweight; search lives on the home/tools pages.
 */

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ThemeControl } from "@/components/shared/ThemeControl";

export function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.75rem 1.5rem",
        backgroundColor:
          "color-mix(in srgb, var(--color-background) 85%, transparent)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <Link
        href={ROUTES.HOME}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <span
          aria-hidden="true"
          className="spin-slow"
          style={{
            display: "inline-block",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background:
              "conic-gradient(from 0deg, var(--color-brand), var(--color-accent), var(--color-brand))",
          }}
        />
        <span
          style={{
            fontWeight: 800,
            fontSize: "1.125rem",
            letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
          }}
        >
          Quasar
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          href={ROUTES.TOOLS}
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          All Tools
        </Link>
        <ThemeControl />
      </div>
    </nav>
  );
}
