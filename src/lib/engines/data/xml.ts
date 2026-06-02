/** XML parse / build built on fast-xml-parser, wrapped as EngineResults. */

import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import { type EngineResult, ok, err } from "@/types/engines";

const PARSER_OPTIONS = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
  parseAttributeValue: true,
  trimValues: true,
};

const BUILDER_OPTIONS = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  indentBy: "  ",
};

export function parseXml(input: string): EngineResult<unknown> {
  if (!input.trim()) return err("Input is empty.");
  const valid = XMLValidator.validate(input);
  if (valid !== true) {
    const msg = valid.err;
    return err(`${msg.msg} (line ${msg.line})`, { line: msg.line });
  }
  try {
    const parser = new XMLParser(PARSER_OPTIONS);
    return ok(parser.parse(input));
  } catch (e) {
    return err(e instanceof Error ? e.message : "Invalid XML.");
  }
}

export function buildXml(value: unknown): EngineResult<string> {
  try {
    const builder = new XMLBuilder(BUILDER_OPTIONS);
    return ok(builder.build(value).trim());
  } catch (e) {
    return err(e instanceof Error ? e.message : "Could not build XML.");
  }
}

export function formatXml(input: string): EngineResult<string> {
  const parsed = parseXml(input);
  if (!parsed.ok) return parsed;
  return buildXml(parsed.value);
}
