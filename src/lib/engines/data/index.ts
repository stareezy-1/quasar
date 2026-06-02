/**
 * Data engine entry point.
 *
 * Conversion strategy: parse the source format into a canonical JS value, then
 * serialize to the target. This keeps the format matrix linear — any format
 * that can parse-to-value and serialize-from-value composes with all others.
 */

import { type EngineResult, ok, err } from "@/types/engines";
import type { DataFormat } from "./types";
import { parseJson, stringifyJson, minifyJson, formatJson } from "./json";
import { parseYaml, stringifyYaml, formatYaml } from "./yaml";
import { parseCsv, parseTsv, serializeCsv, serializeTsv } from "./csv";
import { parseXml, buildXml, formatXml } from "./xml";

export * from "./types";
export { parseJson, stringifyJson, minifyJson, formatJson } from "./json";
export { parseYaml, stringifyYaml, formatYaml } from "./yaml";
export { parseCsv, parseTsv, serializeCsv, serializeTsv } from "./csv";
export { parseXml, buildXml, formatXml } from "./xml";

/** Parse any supported data format into a canonical JS value. */
export function parseData(
  input: string,
  format: DataFormat,
): EngineResult<unknown> {
  switch (format) {
    case "json":
      return parseJson(input);
    case "yaml":
      return parseYaml(input);
    case "csv":
      return parseCsv(input);
    case "tsv":
      return parseTsv(input);
    case "xml":
      return parseXml(input);
  }
}

/** Serialize a canonical JS value to a target data format. */
export function serializeData(
  value: unknown,
  format: DataFormat,
): EngineResult<string> {
  switch (format) {
    case "json":
      return ok(stringifyJson(value));
    case "yaml":
      return ok(stringifyYaml(value));
    case "csv":
      return serializeCsv(value);
    case "tsv":
      return serializeTsv(value);
    case "xml":
      return buildXml(value);
  }
}

/** Convert data from one format to another. */
export function convertData(
  input: string,
  from: DataFormat,
  to: DataFormat,
): EngineResult<string> {
  if (!input.trim()) return err("Enter some data to convert.");
  const parsed = parseData(input, from);
  if (!parsed.ok) return parsed;
  if (from === to) return serializeData(parsed.value, to);
  return serializeData(parsed.value, to);
}

/** Format (prettify) data in place for the given format. */
export function formatData(
  input: string,
  format: DataFormat,
  indent = 2,
): EngineResult<string> {
  switch (format) {
    case "json":
      return formatJson(input, indent);
    case "yaml":
      return formatYaml(input);
    case "xml":
      return formatXml(input);
    case "csv":
    case "tsv": {
      // Round-trip through the parser to normalize.
      const parsed = parseData(input, format);
      if (!parsed.ok) return parsed;
      return serializeData(parsed.value, format);
    }
  }
}
