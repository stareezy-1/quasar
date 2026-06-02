/**
 * Unit conversion engine.
 *
 * Every unit category defines a map of unit → factor relative to a base unit.
 * Conversion is then: value_in_base = value * factor[from]; result =
 * value_in_base / factor[to]. Temperature is special-cased (affine, not
 * linear) and handled separately.
 */

import { type EngineResult, ok, err } from "@/types/engines";

export type UnitCategory =
  | "length"
  | "weight"
  | "volume"
  | "area"
  | "time"
  | "temperature"
  | "speed"
  | "data";

export interface UnitDef {
  id: string;
  label: string;
  /** Multiplier to convert this unit into the category's base unit. */
  factor: number;
}

export interface CategoryDef {
  id: UnitCategory;
  label: string;
  baseUnit: string;
  units: UnitDef[];
}

/** All linear unit categories (temperature handled separately). */
export const UNIT_CATEGORIES: Record<UnitCategory, CategoryDef> = {
  length: {
    id: "length",
    label: "Length",
    baseUnit: "m",
    units: [
      { id: "mm", label: "Millimeter", factor: 0.001 },
      { id: "cm", label: "Centimeter", factor: 0.01 },
      { id: "m", label: "Meter", factor: 1 },
      { id: "km", label: "Kilometer", factor: 1000 },
      { id: "in", label: "Inch", factor: 0.0254 },
      { id: "ft", label: "Foot", factor: 0.3048 },
      { id: "yd", label: "Yard", factor: 0.9144 },
      { id: "mi", label: "Mile", factor: 1609.344 },
    ],
  },
  weight: {
    id: "weight",
    label: "Weight / Mass",
    baseUnit: "g",
    units: [
      { id: "mg", label: "Milligram", factor: 0.001 },
      { id: "g", label: "Gram", factor: 1 },
      { id: "kg", label: "Kilogram", factor: 1000 },
      { id: "t", label: "Metric Ton", factor: 1_000_000 },
      { id: "oz", label: "Ounce", factor: 28.349523125 },
      { id: "lb", label: "Pound", factor: 453.59237 },
      { id: "st", label: "Stone", factor: 6350.29318 },
    ],
  },
  volume: {
    id: "volume",
    label: "Volume",
    baseUnit: "l",
    units: [
      { id: "ml", label: "Milliliter", factor: 0.001 },
      { id: "l", label: "Liter", factor: 1 },
      { id: "m3", label: "Cubic Meter", factor: 1000 },
      { id: "tsp", label: "Teaspoon (US)", factor: 0.00492892 },
      { id: "tbsp", label: "Tablespoon (US)", factor: 0.0147868 },
      { id: "cup", label: "Cup (US)", factor: 0.236588 },
      { id: "pt", label: "Pint (US)", factor: 0.473176 },
      { id: "gal", label: "Gallon (US)", factor: 3.785411784 },
    ],
  },
  area: {
    id: "area",
    label: "Area",
    baseUnit: "m2",
    units: [
      { id: "mm2", label: "Square Millimeter", factor: 0.000001 },
      { id: "cm2", label: "Square Centimeter", factor: 0.0001 },
      { id: "m2", label: "Square Meter", factor: 1 },
      { id: "ha", label: "Hectare", factor: 10000 },
      { id: "km2", label: "Square Kilometer", factor: 1_000_000 },
      { id: "in2", label: "Square Inch", factor: 0.00064516 },
      { id: "ft2", label: "Square Foot", factor: 0.092903 },
      { id: "ac", label: "Acre", factor: 4046.8564224 },
    ],
  },
  time: {
    id: "time",
    label: "Time",
    baseUnit: "s",
    units: [
      { id: "ms", label: "Millisecond", factor: 0.001 },
      { id: "s", label: "Second", factor: 1 },
      { id: "min", label: "Minute", factor: 60 },
      { id: "h", label: "Hour", factor: 3600 },
      { id: "d", label: "Day", factor: 86400 },
      { id: "wk", label: "Week", factor: 604800 },
      { id: "yr", label: "Year (365d)", factor: 31_536_000 },
    ],
  },
  speed: {
    id: "speed",
    label: "Speed",
    baseUnit: "mps",
    units: [
      { id: "mps", label: "Meters / second", factor: 1 },
      { id: "kph", label: "Kilometers / hour", factor: 0.277778 },
      { id: "mph", label: "Miles / hour", factor: 0.44704 },
      { id: "fps", label: "Feet / second", factor: 0.3048 },
      { id: "knot", label: "Knot", factor: 0.514444 },
    ],
  },
  data: {
    id: "data",
    label: "Data Storage",
    baseUnit: "byte",
    units: [
      { id: "bit", label: "Bit", factor: 0.125 },
      { id: "byte", label: "Byte", factor: 1 },
      { id: "kb", label: "Kilobyte", factor: 1000 },
      { id: "kib", label: "Kibibyte", factor: 1024 },
      { id: "mb", label: "Megabyte", factor: 1_000_000 },
      { id: "mib", label: "Mebibyte", factor: 1_048_576 },
      { id: "gb", label: "Gigabyte", factor: 1_000_000_000 },
      { id: "gib", label: "Gibibyte", factor: 1_073_741_824 },
      { id: "tb", label: "Terabyte", factor: 1_000_000_000_000 },
    ],
  },
  temperature: {
    id: "temperature",
    label: "Temperature",
    baseUnit: "c",
    units: [
      { id: "c", label: "Celsius", factor: 1 },
      { id: "f", label: "Fahrenheit", factor: 1 },
      { id: "k", label: "Kelvin", factor: 1 },
    ],
  },
};

/** Convert temperature between c/f/k. */
function convertTemperature(value: number, from: string, to: string): number {
  // Normalize to Celsius first.
  let c: number;
  switch (from) {
    case "c":
      c = value;
      break;
    case "f":
      c = ((value - 32) * 5) / 9;
      break;
    case "k":
      c = value - 273.15;
      break;
    default:
      c = value;
  }
  switch (to) {
    case "c":
      return c;
    case "f":
      return (c * 9) / 5 + 32;
    case "k":
      return c + 273.15;
    default:
      return c;
  }
}

/** Convert a value between two units of the same category. */
export function convertUnit(
  value: number,
  from: string,
  to: string,
  category: UnitCategory,
): EngineResult<number> {
  if (Number.isNaN(value)) return err("Enter a valid number.");
  const def = UNIT_CATEGORIES[category];

  if (category === "temperature") {
    return ok(convertTemperature(value, from, to));
  }

  const fromUnit = def.units.find((u) => u.id === from);
  const toUnit = def.units.find((u) => u.id === to);
  if (!fromUnit || !toUnit) return err("Unknown unit.");

  const base = value * fromUnit.factor;
  return ok(base / toUnit.factor);
}
