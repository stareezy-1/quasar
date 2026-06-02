/**
 * CSV / TSV parse and serialize built on papaparse.
 *
 * Parsing yields an array of row objects (header row → keys). Serializing
 * accepts either an array of objects or a 2D array.
 */

import Papa from "papaparse";
import { type EngineResult, ok, err } from "@/types/engines";

/** Parse delimited text into an array of row objects. */
export function parseDelimited(
  input: string,
  delimiter: "," | "\t",
): EngineResult<unknown[]> {
  if (!input.trim()) return err("Input is empty.");
  const result = Papa.parse(input.trim(), {
    header: true,
    skipEmptyLines: true,
    delimiter,
    dynamicTyping: true,
  });
  if (result.errors.length > 0) {
    const first = result.errors[0]!;
    return err(`${first.message} (row ${first.row ?? "?"})`);
  }
  return ok(result.data);
}

/** Serialize an array of objects (or 2D array) to delimited text. */
export function serializeDelimited(
  value: unknown,
  delimiter: "," | "\t",
): EngineResult<string> {
  if (!Array.isArray(value)) {
    return err("CSV/TSV output requires an array of rows.");
  }
  try {
    return ok(Papa.unparse(value as object[], { delimiter }));
  } catch (e) {
    return err(e instanceof Error ? e.message : "Could not serialize to CSV.");
  }
}

export const parseCsv = (input: string) => parseDelimited(input, ",");
export const parseTsv = (input: string) => parseDelimited(input, "\t");
export const serializeCsv = (value: unknown) => serializeDelimited(value, ",");
export const serializeTsv = (value: unknown) => serializeDelimited(value, "\t");
