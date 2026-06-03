/**
 * Number ↔ English words conversion (integer range: -999 quadrillion to +999 quadrillion).
 */

import { type EngineResult, ok, err } from "@/types/engines";

const ONES = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const SCALES = [
  "",
  "thousand",
  "million",
  "billion",
  "trillion",
  "quadrillion",
];

function chunkToWords(n: number): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} hundred`);
  if (rest < 20) {
    if (ONES[rest]) parts.push(ONES[rest]!);
  } else {
    const t = Math.floor(rest / 10);
    const o = rest % 10;
    parts.push(TENS[t]! + (o ? `-${ONES[o]}` : ""));
  }
  return parts.join(" ");
}

export function numberToWords(input: string): EngineResult<string> {
  const trimmed = input.trim();
  if (!trimmed) return err("Enter a number.");
  const neg = trimmed.startsWith("-");
  const abs = trimmed.replace(/^-/, "").replace(/,/g, "");
  if (!/^\d+$/.test(abs)) return err("Enter an integer.");
  if (abs.length > 18) return err("Number too large (max 18 digits).");

  const n = BigInt(abs);
  if (n === 0n) return ok("zero");

  const parts: string[] = [];
  let remaining = n;
  let scaleIdx = 0;
  while (remaining > 0n) {
    const chunk = Number(remaining % 1000n);
    if (chunk !== 0) {
      const words = chunkToWords(chunk);
      const scale = SCALES[scaleIdx];
      parts.unshift(scale ? `${words} ${scale}` : words);
    }
    remaining = remaining / 1000n;
    scaleIdx++;
  }

  const result = parts.join(", ");
  return ok(neg ? `negative ${result}` : result);
}

const WORD_MAP: Record<string, number> = {};
ONES.forEach((w, i) => {
  if (w) WORD_MAP[w] = i;
});
TENS.forEach((w, i) => {
  if (w) WORD_MAP[w] = i * 10;
});
WORD_MAP["hundred"] = 100;
SCALES.forEach((w, i) => {
  if (w) WORD_MAP[w] = Math.pow(10, i * 3);
});
WORD_MAP["zero"] = 0;
WORD_MAP["negative"] = -1; // sentinel

export function wordsToNumber(input: string): EngineResult<string> {
  const words = input
    .toLowerCase()
    .trim()
    .replace(/-/g, " ")
    .split(/[\s,]+/)
    .filter(Boolean);
  if (!words.length) return err("Enter number words.");
  let negative = false;
  if (words[0] === "negative") {
    negative = true;
    words.shift();
  }
  if (words[0] === "zero") return ok("0");

  let total = 0n;
  let current = 0n;

  for (const w of words) {
    const val = WORD_MAP[w];
    if (val === undefined) return err(`Unknown word: "${w}"`);
    if (val === 100) {
      current = current * 100n;
    } else if (val >= 1000) {
      current = (current + BigInt(val) > 0n ? current : 1n) * BigInt(val);
      total += current;
      current = 0n;
    } else {
      current += BigInt(val);
    }
  }
  total += current;
  return ok((negative ? "-" : "") + total.toString());
}
