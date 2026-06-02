"use client";

/**
 * ThemeProvider — manages palette + mode, persists to localStorage, and writes
 * `data-palette` / `data-theme` / `data-mode` attributes onto <html>. Mirrors
 * the next-gen-portfolio theming approach.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME_MODE,
  DEFAULT_THEME_PALETTE,
  THEME_DATA_ATTRIBUTES,
  THEME_STORAGE_KEYS,
  type ThemeMode,
  type ThemePalette,
} from "@/constants/theme";
import { readRaw, writeRaw } from "@/lib/sessions/storage";

interface ThemeState {
  mode: ThemeMode;
  palette: ThemePalette;
}

interface ThemeControl {
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePalette) => void;
}

const ThemeStateContext = createContext<ThemeState | null>(null);
const ThemeControlContext = createContext<ThemeControl | null>(null);

/** Resolve "system" mode into an effective dark/light. */
function resolveMode(mode: ThemeMode): "dark" | "light" {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Apply theme attributes to <html>. */
function applyAttributes(mode: ThemeMode, palette: ThemePalette): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute(THEME_DATA_ATTRIBUTES.palette, palette);
  root.setAttribute(THEME_DATA_ATTRIBUTES.theme, resolveMode(mode));
  root.setAttribute(THEME_DATA_ATTRIBUTES.mode, mode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [palette, setPaletteState] = useState<ThemePalette>(
    DEFAULT_THEME_PALETTE,
  );

  // Hydrate from storage on mount.
  useEffect(() => {
    const storedMode = readRaw(THEME_STORAGE_KEYS.mode) as ThemeMode | null;
    const storedPalette = readRaw(
      THEME_STORAGE_KEYS.palette,
    ) as ThemePalette | null;
    if (storedMode) setModeState(storedMode);
    if (storedPalette) setPaletteState(storedPalette);
  }, []);

  // Re-apply attributes whenever state changes.
  useEffect(() => {
    applyAttributes(mode, palette);
  }, [mode, palette]);

  // React to OS theme changes while in system mode.
  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyAttributes(mode, palette);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode, palette]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    writeRaw(THEME_STORAGE_KEYS.mode, next);
  }, []);

  const setPalette = useCallback((next: ThemePalette) => {
    setPaletteState(next);
    writeRaw(THEME_STORAGE_KEYS.palette, next);
  }, []);

  const state = useMemo<ThemeState>(() => ({ mode, palette }), [mode, palette]);
  const control = useMemo<ThemeControl>(
    () => ({ setMode, setPalette }),
    [setMode, setPalette],
  );

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeControlContext.Provider value={control}>
        {children}
      </ThemeControlContext.Provider>
    </ThemeStateContext.Provider>
  );
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeStateContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function useThemeControl(): ThemeControl {
  const ctx = useContext(ThemeControlContext);
  if (!ctx)
    throw new Error("useThemeControl must be used within ThemeProvider");
  return ctx;
}
