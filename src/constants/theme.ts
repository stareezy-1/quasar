/** Theme constants — mirrors the next-gen-portfolio palette/mode system. */

export type ThemeMode = "dark" | "light" | "system";
export type ThemePalette = "aurora" | "dark" | "steins-gate";

export const THEME_STORAGE_KEYS = {
  mode: "quasar-theme-mode",
  palette: "quasar-theme-palette",
} as const;

export const DEFAULT_THEME_MODE: ThemeMode = "dark";
export const DEFAULT_THEME_PALETTE: ThemePalette = "aurora";

export const THEME_MODES: readonly ThemeMode[] = [
  "dark",
  "light",
  "system",
] as const;

export const THEME_PALETTES: readonly ThemePalette[] = [
  "aurora",
  "dark",
  "steins-gate",
] as const;

export const THEME_DATA_ATTRIBUTES = {
  palette: "data-palette",
  theme: "data-theme",
  mode: "data-mode",
} as const;
