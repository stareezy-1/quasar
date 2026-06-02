/**
 * Color engine entry point.
 *
 * Strategy: parse any input format into a canonical {@link Rgb}, then serialize
 * to the target format. This keeps the conversion matrix O(formats) instead of
 * O(formats²).
 */

import { type EngineResult, ok, err } from "@/types/engines";
import type { ColorFormat, Rgb } from "./types";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToCmyk,
  cmykToRgb,
} from "./convert";
import { colortoneToHex, nearestColortone } from "./colortone";

export * from "./types";
export * from "./convert";
export * from "./colortone";

/** Parse free-form numeric input like "120, 45, 9" or "120 45 9". */
function parseNumbers(input: string, count: number): number[] | null {
  const nums = input
    .trim()
    .replace(/[^\d.,\s-]/g, " ")
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  if (nums.length !== count || nums.some((n) => Number.isNaN(n))) return null;
  return nums;
}

/** Parse any supported format into canonical RGB. */
export function parseColor(input: string, format: ColorFormat): Rgb | null {
  const raw = input.trim();
  switch (format) {
    case "hex":
      return hexToRgb(raw);
    case "rgb": {
      const n = parseNumbers(raw, 3);
      return n ? { r: n[0]!, g: n[1]!, b: n[2]! } : null;
    }
    case "hsl": {
      const n = parseNumbers(raw, 3);
      return n ? hslToRgb({ h: n[0]!, s: n[1]!, l: n[2]! }) : null;
    }
    case "hsv": {
      const n = parseNumbers(raw, 3);
      return n ? hsvToRgb({ h: n[0]!, s: n[1]!, v: n[2]! }) : null;
    }
    case "cmyk": {
      const n = parseNumbers(raw, 4);
      return n ? cmykToRgb({ c: n[0]!, m: n[1]!, y: n[2]!, k: n[3]! }) : null;
    }
    case "colortone": {
      const hex = colortoneToHex(raw);
      return hex ? hexToRgb(hex) : null;
    }
  }
}

/** Serialize canonical RGB to a target format string. */
export function formatColor(rgb: Rgb, format: ColorFormat): string {
  switch (format) {
    case "hex":
      return rgbToHex(rgb);
    case "rgb": {
      const { r, g, b } = rgb;
      return `rgb(${r}, ${g}, ${b})`;
    }
    case "hsl": {
      const { h, s, l } = rgbToHsl(rgb);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    case "hsv": {
      const { h, s, v } = rgbToHsv(rgb);
      return `hsv(${h}, ${s}%, ${v}%)`;
    }
    case "cmyk": {
      const { c, m, y, k } = rgbToCmyk(rgb);
      return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
    }
    case "colortone":
      return nearestColortone(rgb);
  }
}

/** Human-readable label for a color format. */
export const COLOR_FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: "HEX",
  rgb: "RGB",
  hsl: "HSL",
  hsv: "HSV",
  cmyk: "CMYK",
  colortone: "Colortone",
};

/**
 * Convert a color string from one format to another. Returns an EngineResult
 * carrying the formatted string or a descriptive error.
 */
export function convertColor(
  input: string,
  from: ColorFormat,
  to: ColorFormat,
): EngineResult<string> {
  if (!input.trim()) return err("Enter a color value to convert.");
  const rgb = parseColor(input, from);
  if (!rgb) {
    return err(
      `"${input.trim()}" is not a valid ${COLOR_FORMAT_LABELS[from]} color.`,
    );
  }
  return ok(formatColor(rgb, to));
}
