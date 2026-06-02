/**
 * "Colortone" = named colors. We map the common CSS named colors to hex and
 * provide a reverse lookup that finds the nearest named color for any RGB.
 */

import type { Rgb } from "./types";
import { hexToRgb } from "./convert";

/** A subset of the CSS named colors — enough for practical conversions. */
export const NAMED_COLORS: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  lime: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  silver: "#C0C0C0",
  gray: "#808080",
  maroon: "#800000",
  olive: "#808000",
  green: "#008000",
  purple: "#800080",
  teal: "#008080",
  navy: "#000080",
  orange: "#FFA500",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  gold: "#FFD700",
  indigo: "#4B0082",
  violet: "#EE82EE",
  coral: "#FF7F50",
  salmon: "#FA8072",
  khaki: "#F0E68C",
  crimson: "#DC143C",
  turquoise: "#40E0D0",
  lavender: "#E6E6FA",
  beige: "#F5F5DC",
  ivory: "#FFFFF0",
  tomato: "#FF6347",
  orchid: "#DA70D6",
  chocolate: "#D2691E",
  skyblue: "#87CEEB",
  steelblue: "#4682B4",
  slategray: "#708090",
  seagreen: "#2E8B57",
  forestgreen: "#228B22",
  midnightblue: "#191970",
  hotpink: "#FF69B4",
  tan: "#D2B48C",
};

/** Look up a named color's hex (case-insensitive). Returns null if unknown. */
export function colortoneToHex(name: string): string | null {
  const key = name.trim().toLowerCase();
  return NAMED_COLORS[key] ?? null;
}

/**
 * Find the nearest named color to an RGB value using squared Euclidean
 * distance in RGB space. Always returns a name (the table is non-empty).
 */
export function nearestColortone(rgb: Rgb): string {
  let best = "black";
  let bestDist = Infinity;
  for (const [name, hex] of Object.entries(NAMED_COLORS)) {
    const c = hexToRgb(hex);
    if (!c) continue;
    const dist = (c.r - rgb.r) ** 2 + (c.g - rgb.g) ** 2 + (c.b - rgb.b) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = name;
    }
  }
  return best;
}
