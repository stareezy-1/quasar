import type { CategoryMeta, ToolCategory } from "@/types/tool";

/** Display metadata for each tool category. */
export const CATEGORIES: Record<ToolCategory, CategoryMeta> = {
  json: {
    id: "json",
    label: "JSON",
    description: "Format, validate, convert, and diff JSON.",
    icon: "{ }",
    accent: "#00ff88",
  },
  xml: {
    id: "xml",
    label: "XML",
    description: "Format, validate, and convert XML.",
    icon: "</>",
    accent: "#f59e0b",
  },
  html: {
    id: "html",
    label: "HTML",
    description: "Strip, encode, and convert HTML & Markdown.",
    icon: "◆",
    accent: "#ec4899",
  },
  sql: {
    id: "sql",
    label: "SQL",
    description: "Convert SQL inserts to data formats.",
    icon: "▤",
    accent: "#3b82f6",
  },
  csv: {
    id: "csv",
    label: "CSV",
    description: "View and convert CSV / TSV data.",
    icon: "▦",
    accent: "#8b5cf6",
  },
  color: {
    id: "color",
    label: "Color",
    description: "Convert between HEX, RGB, HSL, HSV, CMYK.",
    icon: "◉",
    accent: "#7c3aed",
  },
  unit: {
    id: "unit",
    label: "Unit",
    description: "Convert length, weight, volume, time, and more.",
    icon: "⚖",
    accent: "#22c55e",
  },
  base64: {
    id: "base64",
    label: "Base64",
    description: "Encode and decode Base64.",
    icon: "⬡",
    accent: "#06b6d4",
  },
  image: {
    id: "image",
    label: "Image",
    description: "Convert and inspect images.",
    icon: "▢",
    accent: "#f43f5e",
  },
  string: {
    id: "string",
    label: "String",
    description: "Transform, analyze, and clean up text.",
    icon: "“”",
    accent: "#eab308",
  },
  utility: {
    id: "utility",
    label: "Utility",
    description: "Diffs, validators, generators, and more.",
    icon: "✦",
    accent: "#14b8a6",
  },
};

/** Ordered list of categories for navigation/home. */
export const CATEGORY_ORDER: ToolCategory[] = [
  "json",
  "xml",
  "html",
  "csv",
  "sql",
  "color",
  "unit",
  "base64",
  "string",
  "utility",
  "image",
];
