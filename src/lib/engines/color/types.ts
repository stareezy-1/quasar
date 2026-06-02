/** Supported color formats. */
export type ColorFormat = "hex" | "rgb" | "hsl" | "hsv" | "cmyk" | "colortone";

/** Canonical internal representation: RGB with 0–255 channels. */
export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** HSL: hue 0–360, saturation/lightness 0–100. */
export interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** HSV/HSB: hue 0–360, saturation/value 0–100. */
export interface Hsv {
  h: number;
  s: number;
  v: number;
}

/** CMYK: all channels 0–100. */
export interface Cmyk {
  c: number;
  m: number;
  y: number;
  k: number;
}
