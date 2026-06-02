import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  stringToHex,
  hexToString,
  stringToBinary,
  binaryToString,
  encodeBase64,
  decodeBase64,
} from "@/lib/engines/string";

describe("encoding round-trips", () => {
  it("text → hex → text", () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const back = hexToString(stringToHex(text));
        expect(back.ok).toBe(true);
        if (back.ok) expect(back.value).toBe(text);
      }),
    );
  });

  it("text → binary → text", () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const back = binaryToString(stringToBinary(text));
        expect(back.ok).toBe(true);
        if (back.ok) expect(back.value).toBe(text);
      }),
    );
  });

  it("text → base64 → text", () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const back = decodeBase64(encodeBase64(text));
        expect(back.ok).toBe(true);
        if (back.ok) expect(back.value).toBe(text);
      }),
    );
  });
});
