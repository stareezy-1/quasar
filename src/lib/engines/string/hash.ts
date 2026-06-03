/**
 * Hash utilities — NTLM hash (MD4-based) and a pure-JS MD5 implementation.
 * These run entirely client-side with no external deps.
 */

import { type EngineResult, ok } from "@/types/engines";

// ── MD5 ────────────────────────────────────────────────────────────────────

function md5(input: string): string {
  const msg = unescape(encodeURIComponent(input));
  const m = Array.from({ length: msg.length }, (_, i) => msg.charCodeAt(i));

  // padding
  const bitLen = msg.length * 8;
  m.push(0x80);
  while (m.length % 64 !== 56) m.push(0);
  m.push(
    bitLen & 0xff,
    (bitLen >>> 8) & 0xff,
    (bitLen >>> 16) & 0xff,
    (bitLen >>> 24) & 0xff,
    0,
    0,
    0,
    0,
  );

  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476;

  const T: number[] = Array.from({ length: 64 }, (_, i) =>
    Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000),
  );
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
    9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
    16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10,
    15, 21,
  ];

  const add = (x: number, y: number) => (x + y) & 0xffffffff;
  const rotl = (x: number, n: number) => (x << n) | (x >>> (32 - n));
  const words = (block: number[]) =>
    Array.from(
      { length: 16 },
      (_, i) =>
        block[i * 4]! |
        (block[i * 4 + 1]! << 8) |
        (block[i * 4 + 2]! << 16) |
        (block[i * 4 + 3]! << 24),
    );

  for (let blk = 0; blk < m.length; blk += 64) {
    const W = words(m.slice(blk, blk + 64));
    let [A, B, C, D] = [a, b, c, d];
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      const temp = D!;
      D = C!;
      C = B!;
      B = add(B!, rotl(add(add(A!, F!), add(W[g]! | 0, T[i]!)), S[i]!));
      A = temp;
    }
    a = add(a, A!);
    b = add(b, B!);
    c = add(c, C!);
    d = add(d, D!);
  }

  const hex = (n: number) =>
    [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  return hex(a) + hex(b) + hex(c) + hex(d);
}

export function md5Hash(input: string): EngineResult<string> {
  return ok(md5(input));
}

// ── NTLM (MD4) ─────────────────────────────────────────────────────────────

function md4(bytes: Uint8Array): string {
  const bitLen = bytes.length * 8;
  const padded: number[] = Array.from(bytes);
  padded.push(0x80);
  while (padded.length % 64 !== 56) padded.push(0);
  for (let i = 0; i < 8; i++) padded.push((bitLen / Math.pow(256, i)) & 0xff);

  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476;
  const add = (x: number, y: number) => (x + y) >>> 0;
  const rol = (x: number, n: number) => (x << n) | (x >>> (32 - n));

  for (let i = 0; i < padded.length; i += 64) {
    const X: number[] = [];
    for (let j = 0; j < 16; j++) {
      X.push(
        padded[i + j * 4]! |
          (padded[i + j * 4 + 1]! << 8) |
          (padded[i + j * 4 + 2]! << 16) |
          (padded[i + j * 4 + 3]! << 24),
      );
    }
    let [A, B, C, D] = [a, b, c, d];
    const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
    const G = (x: number, y: number, z: number) => (x & y) | (x & z) | (y & z);
    const H = (x: number, y: number, z: number) => x ^ y ^ z;

    const r1 = [3, 7, 11, 19];
    const r2 = [3, 5, 9, 13];
    const r3 = [3, 9, 11, 15];
    const o1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const o2 = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
    const o3 = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];

    for (let j = 0; j < 16; j++) {
      const rr = r1[j % 4]!;
      const tmp = add(add(A!, F(B!, C!, D!)), X[o1[j]!]!);
      A = D!;
      D = C!;
      C = B!;
      B = rol(tmp, rr);
    }
    for (let j = 0; j < 16; j++) {
      const rr = r2[j % 4]!;
      const tmp = add(add(add(A!, G(B!, C!, D!)), X[o2[j]!]!), 0x5a827999);
      A = D!;
      D = C!;
      C = B!;
      B = rol(tmp, rr);
    }
    for (let j = 0; j < 16; j++) {
      const rr = r3[j % 4]!;
      const tmp = add(add(add(A!, H(B!, C!, D!)), X[o3[j]!]!), 0x6ed9eba1);
      A = D!;
      D = C!;
      C = B!;
      B = rol(tmp, rr);
    }
    a = add(a, A!);
    b = add(b, B!);
    c = add(c, C!);
    d = add(d, D!);
  }

  const leHex = (n: number) =>
    [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  return leHex(a) + leHex(b) + leHex(c) + leHex(d);
}

export function ntlmHash(input: string): EngineResult<string> {
  // NTLM uses UTF-16LE encoding of the input
  const utf16: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    utf16.push(code & 0xff, (code >> 8) & 0xff);
  }
  return ok(md4(new Uint8Array(utf16)).toUpperCase());
}
