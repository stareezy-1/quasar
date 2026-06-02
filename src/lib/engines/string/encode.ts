/**
 * Encoding conversions between text and hex / binary / base64 representations.
 * Uses TextEncoder/TextDecoder for correct UTF-8 handling.
 */

import { type EngineResult, ok, err } from "@/types/engines";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function stringToHex(input: string): string {
  return Array.from(encoder.encode(input))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

export function hexToString(input: string): EngineResult<string> {
  const cleaned = input.replace(/0x/gi, "").replace(/[\s,]+/g, "");
  if (cleaned === "") return ok("");
  if (cleaned.length % 2 !== 0) {
    return err("Hex input must have an even number of digits.");
  }
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
    return err("Input contains non-hex characters.");
  }
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return ok(decoder.decode(bytes));
}

export function stringToBinary(input: string): string {
  return Array.from(encoder.encode(input))
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

export function binaryToString(input: string): EngineResult<string> {
  const groups = input.trim().split(/\s+/).filter(Boolean);
  if (groups.length === 0) return ok("");
  if (groups.some((g) => !/^[01]{1,8}$/.test(g))) {
    return err("Each group must be 1–8 binary digits.");
  }
  const bytes = new Uint8Array(groups.length);
  for (let i = 0; i < groups.length; i++) {
    bytes[i] = parseInt(groups[i]!, 2);
  }
  return ok(decoder.decode(bytes));
}

export function encodeBase64(input: string): string {
  const bytes = encoder.encode(input);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function decodeBase64(input: string): EngineResult<string> {
  try {
    const binary = atob(input.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return ok(decoder.decode(bytes));
  } catch {
    return err("Invalid Base64 input.");
  }
}
