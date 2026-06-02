/**
 * Line and text transforms — the "Remove *", "Sort", and reversal utilities.
 * All are pure string → string functions.
 */

export function reverseString(input: string): string {
  return Array.from(input).reverse().join("");
}

export function reverseWords(input: string): string {
  return input.split(/(\s+)/).reverse().join("");
}

export function removeDuplicateLines(input: string): string {
  const seen = new Set<string>();
  return input
    .split("\n")
    .filter((line) => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    })
    .join("\n");
}

export function removeEmptyLines(input: string): string {
  return input
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
}

export function removeExtraSpaces(input: string): string {
  return input
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n");
}

export function removeWhitespace(input: string): string {
  return input.replace(/\s+/g, "");
}

export function removeLineBreaks(input: string): string {
  return input
    .replace(/\r?\n/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function removeLinesContaining(input: string, needle: string): string {
  if (!needle) return input;
  return input
    .split("\n")
    .filter((line) => !line.includes(needle))
    .join("\n");
}

export function removePunctuation(input: string): string {
  return input.replace(/[!-/:-@[-`{-~]/g, "");
}

export function removeAccents(input: string): string {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function sortLines(input: string, descending = false): string {
  const lines = input.split("\n").sort((a, b) => a.localeCompare(b));
  if (descending) lines.reverse();
  return lines.join("\n");
}

export function sortWords(input: string, descending = false): string {
  const words = input
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  if (descending) words.reverse();
  return words.join(" ");
}

export function repeatText(input: string, times: number): string {
  const n = Math.max(0, Math.floor(times));
  return input.repeat(n);
}

/** Flip text upside down using a Unicode character map. */
export function upsideDown(input: string): string {
  const map: Record<string, string> = {
    a: "ɐ",
    b: "q",
    c: "ɔ",
    d: "p",
    e: "ǝ",
    f: "ɟ",
    g: "ƃ",
    h: "ɥ",
    i: "ı",
    j: "ɾ",
    k: "ʞ",
    l: "l",
    m: "ɯ",
    n: "u",
    o: "o",
    p: "d",
    q: "b",
    r: "ɹ",
    s: "s",
    t: "ʇ",
    u: "n",
    v: "ʌ",
    w: "ʍ",
    x: "x",
    y: "ʎ",
    z: "z",
    "0": "0",
    "1": "Ɩ",
    "2": "ᄅ",
    "3": "Ɛ",
    "4": "ㄣ",
    "5": "ϛ",
    "6": "9",
    "7": "ㄥ",
    "8": "8",
    "9": "6",
    ".": "˙",
    ",": "'",
    "?": "¿",
    "!": "¡",
    "'": ",",
    '"': ",,",
    "(": ")",
    ")": "(",
    "[": "]",
    "]": "[",
    "{": "}",
    "}": "{",
    "<": ">",
    ">": "<",
    "&": "⅋",
    _: "‾",
  };
  return Array.from(input.toLowerCase())
    .reverse()
    .map((c) => map[c] ?? c)
    .join("");
}
