/**
 * Color conversion math. Every format converts to/from a canonical {@link Rgb}
 * value, so adding a new format only needs an rgb↔format pair.
 *
 * All functions here are pure and clamp/round defensively so round-trips stay
 * stable.
 */

import type { Rgb, Hsl, Hsv, Cmyk } from "./types";

/** Clamp a number into an inclusive range. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Round to a fixed number of decimals (default 0). */
function round(n: number, decimals = 0): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

// ─── RGB ↔ HEX ──────────────────────────────────────────────────────────────

export function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToRgb(hex: string): Rgb | null {
  let h = hex.trim().replace(/^#/, "");
  // Expand shorthand (#abc → #aabbcc).
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// ─── RGB ↔ HSL ──────────────────────────────────────────────────────────────

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / delta + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
    }
    h /= 6;
  }
  return { h: round(h * 360), s: round(s * 100), l: round(l * 100) };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hn = (((h % 360) + 360) % 360) / 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  if (sn === 0) {
    const v = round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hue2rgb = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return {
    r: round(hue2rgb(hn + 1 / 3) * 255),
    g: round(hue2rgb(hn) * 255),
    b: round(hue2rgb(hn - 1 / 3) * 255),
  };
}

// ─── RGB ↔ HSV ──────────────────────────────────────────────────────────────

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case rn:
        h = (gn - bn) / delta + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
    }
    h /= 6;
  }
  const s = max === 0 ? 0 : delta / max;
  return { h: round(h * 360), s: round(s * 100), v: round(max * 100) };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const hn = (((h % 360) + 360) % 360) / 60;
  const sn = clamp(s, 0, 100) / 100;
  const vn = clamp(v, 0, 100) / 100;

  const i = Math.floor(hn);
  const f = hn - i;
  const p = vn * (1 - sn);
  const q = vn * (1 - sn * f);
  const t = vn * (1 - sn * (1 - f));

  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0:
      [r, g, b] = [vn, t, p];
      break;
    case 1:
      [r, g, b] = [q, vn, p];
      break;
    case 2:
      [r, g, b] = [p, vn, t];
      break;
    case 3:
      [r, g, b] = [p, q, vn];
      break;
    case 4:
      [r, g, b] = [t, p, vn];
      break;
    default:
      [r, g, b] = [vn, p, q];
  }
  return { r: round(r * 255), g: round(g * 255), b: round(b * 255) };
}

// ─── RGB ↔ CMYK ─────────────────────────────────────────────────────────────

export function rgbToCmyk({ r, g, b }: Rgb): Cmyk {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: round(((1 - rn - k) / (1 - k)) * 100),
    m: round(((1 - gn - k) / (1 - k)) * 100),
    y: round(((1 - bn - k) / (1 - k)) * 100),
    k: round(k * 100),
  };
}

export function cmykToRgb({ c, m, y, k }: Cmyk): Rgb {
  const cn = clamp(c, 0, 100) / 100;
  const mn = clamp(m, 0, 100) / 100;
  const yn = clamp(y, 0, 100) / 100;
  const kn = clamp(k, 0, 100) / 100;
  return {
    r: round(255 * (1 - cn) * (1 - kn)),
    g: round(255 * (1 - mn) * (1 - kn)),
    b: round(255 * (1 - yn) * (1 - kn)),
  };
}
