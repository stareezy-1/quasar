"use client";

/**
 * Nav — top app bar. Desktop: wordmark + links + ThemeControl inline.
 * Mobile (≤768px): wordmark + hamburger → full-screen drawer with links,
 * theme palette dots, and mode toggle.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useTheme, useThemeControl } from "@/providers/ThemeProvider";
import {
  THEME_PALETTES,
  type ThemeMode,
  type ThemePalette,
} from "@/constants/theme";

const PALETTE_COLORS: Record<ThemePalette, string> = {
  aurora: "#00ff88",
  dark: "#4a9eff",
  "steins-gate": "#e8dcc8",
  quasar: "#ff6a1a",
};
const PALETTE_LABELS: Record<ThemePalette, string> = {
  aurora: "Aurora",
  dark: "Dark",
  "steins-gate": "Steins;Gate",
  quasar: "Quasar",
};
const MODE_CYCLE: ThemeMode[] = ["dark", "light", "system"];
const MODE_ICONS: Record<ThemeMode, string> = {
  dark: "☾",
  light: "☀",
  system: "⚙",
};
const MODE_LABELS: Record<ThemeMode, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

const NAV_LINKS = [
  { href: ROUTES.TOOLS, label: "All Tools" },
  { href: "/faq", label: "FAQ" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { mode, palette } = useTheme();
  const { setMode, setPalette } = useThemeControl();

  useEffect(() => setMounted(true), []);
  // close drawer on route change
  useEffect(() => setOpen(false), [pathname]);
  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const nextMode =
    MODE_CYCLE[(MODE_CYCLE.indexOf(mode) + 1) % MODE_CYCLE.length]!;

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
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
        {/* Wordmark */}
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

        {/* Desktop links */}
        <div
          className="nav-desktop"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color:
                  pathname === href
                    ? "var(--color-brand)"
                    : "var(--color-text-secondary)",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://stareezy.tech"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.4rem 0.75rem",
              borderRadius: "0.5rem",
              border:
                "1px solid color-mix(in srgb, var(--color-brand) 35%, transparent)",
              backgroundColor:
                "color-mix(in srgb, var(--color-brand) 8%, transparent)",
              color: "var(--color-brand)",
              fontSize: "0.8125rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            stareezy.tech ↗
          </a>
          {/* Desktop ThemeControl inline */}
          {mounted && (
            <DesktopThemeControl
              mode={mode}
              palette={palette}
              nextMode={nextMode}
              setMode={setMode}
              setPalette={setPalette}
            />
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            width: "40px",
            height: "40px",
            borderRadius: "0.5rem",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface-elevated)",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              display: "block",
              width: "18px",
              height: "2px",
              backgroundColor: "var(--color-text-primary)",
              transition: "transform 0.2s, opacity 0.2s",
              transform: open ? "rotate(45deg) translate(5px, 5px)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "18px",
              height: "2px",
              backgroundColor: "var(--color-text-primary)",
              opacity: open ? 0 : 1,
              transition: "opacity 0.15s",
            }}
          />
          <span
            style={{
              display: "block",
              width: "18px",
              height: "2px",
              backgroundColor: "var(--color-text-primary)",
              transition: "transform 0.2s, opacity 0.2s",
              transform: open ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          aria-hidden="true"
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 198,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Mobile drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="nav-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 199,
          width: "min(320px, 90vw)",
          backgroundColor: "var(--color-surface)",
          borderLeft: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          padding: "1.25rem 1.25rem 2rem",
          gap: "0",
          overflowY: "auto",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: "1rem",
              color: "var(--color-text-primary)",
            }}
          >
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "0.5rem",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-text-primary)",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            marginBottom: "2rem",
          }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "0.875rem 1rem",
                borderRadius: "0.5rem",
                fontWeight: 600,
                fontSize: "1rem",
                color:
                  pathname === href
                    ? "var(--color-brand)"
                    : "var(--color-text-primary)",
                backgroundColor:
                  pathname === href
                    ? "color-mix(in srgb, var(--color-brand) 10%, transparent)"
                    : "transparent",
                textDecoration: "none",
                display: "block",
                transition: "background-color 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://stareezy.tech"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.875rem 1rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              fontSize: "1rem",
              color: "var(--color-brand)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            stareezy.tech <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "var(--color-border)",
            marginBottom: "1.5rem",
          }}
        />

        {/* Theme section */}
        {mounted && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Theme
            </span>

            {/* Palette picker */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                Palette
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {THEME_PALETTES.map((p) => {
                  const active = palette === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPalette(p)}
                      aria-label={`Switch to ${PALETTE_LABELS[p]} palette`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.5rem",
                        border: `1px solid ${
                          active ? PALETTE_COLORS[p] : "var(--color-border)"
                        }`,
                        backgroundColor: active
                          ? `color-mix(in srgb, ${PALETTE_COLORS[p]} 12%, transparent)`
                          : "var(--color-surface-elevated)",
                        color: active
                          ? PALETTE_COLORS[p]
                          : "var(--color-text-secondary)",
                        fontSize: "0.8125rem",
                        fontWeight: active ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: PALETTE_COLORS[p],
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      {PALETTE_LABELS[p]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode toggle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                Mode
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {MODE_CYCLE.map((m) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      aria-label={`Switch to ${MODE_LABELS[m]} mode`}
                      style={{
                        flex: "1 1 0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0.625rem 0.25rem",
                        borderRadius: "0.5rem",
                        border: `1px solid ${
                          active ? "var(--color-brand)" : "var(--color-border)"
                        }`,
                        backgroundColor: active
                          ? "color-mix(in srgb, var(--color-brand) 10%, transparent)"
                          : "var(--color-surface-elevated)",
                        color: active
                          ? "var(--color-brand)"
                          : "var(--color-text-secondary)",
                        fontSize: "0.75rem",
                        fontWeight: active ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: "1rem" }}>{MODE_ICONS[m]}</span>
                      {MODE_LABELS[m]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DesktopThemeControl({
  mode,
  palette,
  nextMode,
  setMode,
  setPalette,
}: {
  mode: ThemeMode;
  palette: ThemePalette;
  nextMode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  setPalette: (p: ThemePalette) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {THEME_PALETTES.map((p) => {
          const active = palette === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPalette(p)}
              aria-label={`Switch to ${PALETTE_LABELS[p]} palette`}
              title={PALETTE_LABELS[p]}
              style={{
                width: active ? "20px" : "12px",
                height: "12px",
                borderRadius: "9999px",
                backgroundColor: PALETTE_COLORS[p],
                border: "none",
                outline: active ? `2px solid ${PALETTE_COLORS[p]}` : "none",
                outlineOffset: "2px",
                cursor: "pointer",
                padding: 0,
                opacity: active ? 1 : 0.45,
                transition: "width 0.2s ease, opacity 0.15s ease",
              }}
            />
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setMode(nextMode)}
        title={`Theme: ${MODE_LABELS[mode]} — click for ${MODE_LABELS[nextMode]}`}
        aria-label={`Switch to ${MODE_LABELS[nextMode]} mode`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.4rem 0.7rem",
          borderRadius: "0.5rem",
          border: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface-elevated)",
          color: "var(--color-text-primary)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span aria-hidden="true">{MODE_ICONS[mode]}</span>
        <span>{MODE_LABELS[mode]}</span>
      </button>
    </div>
  );
}
