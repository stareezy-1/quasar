"use client";

/**
 * ThemeControl — palette dots + a mode-cycle button. Mirrors the
 * next-gen-portfolio control. Renders palette dots only after mount to avoid
 * SSR hydration mismatch.
 */

import { useEffect, useState } from "react";
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

export function ThemeControl() {
  const { mode, palette } = useTheme();
  const { setMode, setPalette } = useThemeControl();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const nextMode =
    MODE_CYCLE[(MODE_CYCLE.indexOf(mode) + 1) % MODE_CYCLE.length]!;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {mounted && (
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
      )}
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
