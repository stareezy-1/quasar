import type { ToolMeta } from "@/types/tool";

/**
 * THE tool registry — the single source of truth driving routing, navigation,
 * search, and SEO. Each entry lazily loads its React component.
 *
 * Many tools share a generic, config-driven component (e.g. all color
 * converters use `ColorConverter`, which reads its from/to pair from the tool
 * id). This keeps 100+ tools maintainable with a handful of components.
 */
export const TOOLS: ToolMeta[] = [
  // ─── JSON ─────────────────────────────────────────────────────────────
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, prettify, and validate JSON with error reporting.",
    category: "json",
    keywords: ["json", "format", "beautify", "prettify", "validate"],
    icon: "{ }",
    load: () => import("@/components/tools/Formatter"),
  },
  {
    id: "json-minifier",
    name: "JSON Minifier",
    description: "Minify JSON to a single compact line.",
    category: "json",
    keywords: ["json", "minify", "compress", "compact"],
    icon: "{}",
    load: () => import("@/components/tools/JsonMinifier"),
  },
  {
    id: "json-to-xml",
    name: "JSON to XML",
    description: "Convert JSON data into XML.",
    category: "json",
    keywords: ["json", "xml", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/DataConverter"),
  },
  {
    id: "json-to-yaml",
    name: "JSON to YAML",
    description: "Convert JSON data into YAML.",
    category: "json",
    keywords: ["json", "yaml", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/DataConverter"),
  },
  {
    id: "json-to-csv",
    name: "JSON to CSV",
    description: "Convert a JSON array into CSV.",
    category: "json",
    keywords: ["json", "csv", "convert", "table"],
    icon: "⇄",
    load: () => import("@/components/tools/DataConverter"),
  },
  {
    id: "json-diff",
    name: "JSON Diff",
    description: "Compare two JSON documents and see semantic differences.",
    category: "json",
    keywords: ["json", "diff", "compare", "difference"],
    icon: "Δ",
    load: () => import("@/components/tools/DataDiff"),
  },

  // ─── XML ──────────────────────────────────────────────────────────────
  {
    id: "xml-formatter",
    name: "XML Formatter",
    description: "Format, prettify, and validate XML.",
    category: "xml",
    keywords: ["xml", "format", "beautify", "validate"],
    icon: "</>",
    load: () => import("@/components/tools/Formatter"),
  },
  {
    id: "xml-to-json",
    name: "XML to JSON",
    description: "Convert XML documents into JSON.",
    category: "xml",
    keywords: ["xml", "json", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/DataConverter"),
  },
  {
    id: "xml-to-yaml",
    name: "XML to YAML",
    description: "Convert XML documents into YAML.",
    category: "xml",
    keywords: ["xml", "yaml", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/DataConverter"),
  },

  // ─── CSV ──────────────────────────────────────────────────────────────
  {
    id: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV into a JSON array of objects.",
    category: "csv",
    keywords: ["csv", "json", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/DataConverter"),
  },
  {
    id: "csv-to-xml",
    name: "CSV to XML",
    description: "Convert CSV into XML.",
    category: "csv",
    keywords: ["csv", "xml", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/DataConverter"),
  },
  {
    id: "csv-to-yaml",
    name: "CSV to YAML",
    description: "Convert CSV into YAML.",
    category: "csv",
    keywords: ["csv", "yaml", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/DataConverter"),
  },

  // ─── SQL ──────────────────────────────────────────────────────────────
  {
    id: "sql-to-json",
    name: "SQL to JSON",
    description: "Convert SQL INSERT statements into JSON.",
    category: "sql",
    keywords: ["sql", "json", "insert", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/SqlConverter"),
  },
  {
    id: "sql-to-csv",
    name: "SQL to CSV",
    description: "Convert SQL INSERT statements into CSV.",
    category: "sql",
    keywords: ["sql", "csv", "insert", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/SqlConverter"),
  },

  // ─── HTML ─────────────────────────────────────────────────────────────
  {
    id: "html-stripper",
    name: "HTML Stripper",
    description: "Remove all HTML tags and return plain text.",
    category: "html",
    keywords: ["html", "strip", "remove tags", "plain text"],
    icon: "◆",
    load: () => import("@/components/tools/HtmlStripper"),
  },
  {
    id: "html-to-markdown",
    name: "HTML to Markdown",
    description: "Convert HTML into Markdown.",
    category: "html",
    keywords: ["html", "markdown", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/HtmlToMarkdown"),
  },
  {
    id: "markdown-to-html",
    name: "Markdown to HTML",
    description: "Convert Markdown into HTML.",
    category: "html",
    keywords: ["markdown", "html", "convert"],
    icon: "⇄",
    load: () => import("@/components/tools/MarkdownToHtml"),
  },
  {
    id: "text-to-html-entities",
    name: "Text to HTML Entities",
    description: "Encode reserved characters as HTML entities.",
    category: "html",
    keywords: ["html", "entities", "encode", "escape"],
    icon: "&",
    load: () => import("@/components/tools/HtmlEntities"),
  },
  {
    id: "html-entities-to-text",
    name: "HTML Entities to Text",
    description: "Decode HTML entities back to text.",
    category: "html",
    keywords: ["html", "entities", "decode", "unescape"],
    icon: "&",
    load: () => import("@/components/tools/HtmlEntities"),
  },

  // ─── Color ────────────────────────────────────────────────────────────
  ...colorTools(),

  // ─── Unit ─────────────────────────────────────────────────────────────
  ...unitTools(),

  // ─── Base64 ───────────────────────────────────────────────────────────
  {
    id: "text-to-base64",
    name: "Text to Base64",
    description: "Encode text as Base64.",
    category: "base64",
    keywords: ["base64", "encode", "text"],
    icon: "⬡",
    load: () => import("@/components/tools/Base64"),
  },
  {
    id: "base64-to-text",
    name: "Base64 to Text",
    description: "Decode Base64 back to text.",
    category: "base64",
    keywords: ["base64", "decode", "text"],
    icon: "⬡",
    load: () => import("@/components/tools/Base64"),
  },

  // ─── String ───────────────────────────────────────────────────────────
  {
    id: "case-converter",
    name: "Case Converter",
    description:
      "Convert text between camelCase, snake_case, kebab-case, and more.",
    category: "string",
    keywords: ["case", "camel", "snake", "kebab", "upper", "lower"],
    icon: "Aa",
    load: () => import("@/components/tools/CaseConverter"),
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count characters, words, lines, and sentences.",
    category: "string",
    keywords: ["word", "count", "characters", "lines"],
    icon: "#",
    load: () => import("@/components/tools/WordCounter"),
  },
  {
    id: "word-frequency-counter",
    name: "Word Frequency Counter",
    description: "Count how often each word appears.",
    category: "string",
    keywords: ["word", "frequency", "count"],
    icon: "#",
    load: () => import("@/components/tools/WordFrequency"),
  },
  {
    id: "reverse-string",
    name: "Reverse String",
    description: "Reverse the characters of your text.",
    category: "string",
    keywords: ["reverse", "string", "flip"],
    icon: "↺",
    load: () => import("@/components/tools/TextTransform"),
  },
  {
    id: "upside-down-text",
    name: "Upside Down Text",
    description: "Flip text upside down.",
    category: "string",
    keywords: ["upside down", "flip", "text"],
    icon: "↻",
    load: () => import("@/components/tools/TextTransform"),
  },
  {
    id: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    description: "Remove repeated lines from your text.",
    category: "string",
    keywords: ["remove", "duplicate", "lines", "dedupe"],
    icon: "≣",
    load: () => import("@/components/tools/TextTransform"),
  },
  {
    id: "remove-empty-lines",
    name: "Remove Empty Lines",
    description: "Strip out blank lines.",
    category: "string",
    keywords: ["remove", "empty", "blank", "lines"],
    icon: "≣",
    load: () => import("@/components/tools/TextTransform"),
  },
  {
    id: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    description: "Collapse repeated spaces and trim lines.",
    category: "string",
    keywords: ["remove", "spaces", "whitespace", "trim"],
    icon: "≣",
    load: () => import("@/components/tools/TextTransform"),
  },
  {
    id: "sort-text-lines",
    name: "Sort Text Lines",
    description: "Sort lines alphabetically.",
    category: "string",
    keywords: ["sort", "lines", "alphabetical"],
    icon: "↕",
    load: () => import("@/components/tools/TextTransform"),
  },
  {
    id: "string-to-hex",
    name: "String to Hex",
    description: "Encode text as hexadecimal bytes.",
    category: "string",
    keywords: ["string", "hex", "encode"],
    icon: "0x",
    load: () => import("@/components/tools/Encoder"),
  },
  {
    id: "hex-to-string",
    name: "Hex to String",
    description: "Decode hexadecimal bytes back to text.",
    category: "string",
    keywords: ["hex", "string", "decode"],
    icon: "0x",
    load: () => import("@/components/tools/Encoder"),
  },
  {
    id: "string-to-binary",
    name: "String to Binary",
    description: "Encode text as binary.",
    category: "string",
    keywords: ["string", "binary", "encode"],
    icon: "01",
    load: () => import("@/components/tools/Encoder"),
  },
  {
    id: "binary-to-string",
    name: "Binary to String",
    description: "Decode binary back to text.",
    category: "string",
    keywords: ["binary", "string", "decode"],
    icon: "01",
    load: () => import("@/components/tools/Encoder"),
  },

  // ─── Utility ──────────────────────────────────────────────────────────
  {
    id: "text-diff",
    name: "Text Diff",
    description: "Compare two blocks of text line by line.",
    category: "utility",
    keywords: ["diff", "compare", "text", "difference"],
    icon: "Δ",
    load: () => import("@/components/tools/DataDiff"),
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate strong, random passwords.",
    category: "utility",
    keywords: ["password", "generate", "random", "secure"],
    icon: "✦",
    load: () => import("@/components/tools/PasswordGenerator"),
  },
];

/** Build the 23 color converter entries from format pairs. */
function colorTools(): ToolMeta[] {
  const formats: { id: string; label: string }[] = [
    { id: "hex", label: "HEX" },
    { id: "rgb", label: "RGB" },
    { id: "hsl", label: "HSL" },
    { id: "hsv", label: "HSV" },
    { id: "cmyk", label: "CMYK" },
    { id: "colortone", label: "Colortone" },
  ];
  const pairs: [string, string][] = [];
  for (const from of formats) {
    for (const to of formats) {
      if (from.id !== to.id) pairs.push([from.id, to.id]);
    }
  }
  return pairs.map(([from, to]) => {
    const fromLabel = formats.find((f) => f.id === from)!.label;
    const toLabel = formats.find((f) => f.id === to)!.label;
    return {
      id: `${from}-to-${to}`,
      name: `${fromLabel} to ${toLabel}`,
      description: `Convert ${fromLabel} colors to ${toLabel}.`,
      category: "color" as const,
      keywords: ["color", from, to, "convert", fromLabel, toLabel],
      icon: "◉",
      load: () => import("@/components/tools/ColorConverter"),
    };
  });
}

/** Build unit converter entries, one per category. */
function unitTools(): ToolMeta[] {
  const cats: { id: string; name: string; kw: string[] }[] = [
    {
      id: "length-converter",
      name: "Length Converter",
      kw: ["meter", "feet", "inch", "mile"],
    },
    {
      id: "weight-converter",
      name: "Weight Converter",
      kw: ["gram", "kg", "pound", "ounce"],
    },
    {
      id: "volume-converter",
      name: "Volume Converter",
      kw: ["liter", "gallon", "cup"],
    },
    {
      id: "area-converter",
      name: "Area Converter",
      kw: ["square", "acre", "hectare"],
    },
    {
      id: "time-converter",
      name: "Time Converter",
      kw: ["second", "minute", "hour", "day"],
    },
    {
      id: "temperature-converter",
      name: "Temperature Converter",
      kw: ["celsius", "fahrenheit", "kelvin"],
    },
    {
      id: "speed-converter",
      name: "Speed Converter",
      kw: ["mph", "kph", "knot"],
    },
    {
      id: "data-storage-converter",
      name: "Data Storage Converter",
      kw: ["byte", "kb", "mb", "gb"],
    },
  ];
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    description: `${c.name.replace(" Converter", "")} unit conversion.`,
    category: "unit" as const,
    keywords: ["unit", "convert", ...c.kw],
    icon: "⚖",
    load: () => import("@/components/tools/UnitConverter"),
  }));
}
