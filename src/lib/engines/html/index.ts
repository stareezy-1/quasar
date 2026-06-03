/**
 * HTML utilities — stripping tags, entity encode/decode, Markdown↔HTML,
 * HTML↔table, HTML→text/JSON/CSV/YAML conversions, BBCode↔HTML, PUG↔HTML.
 */

import { type EngineResult, ok, err } from "@/types/engines";

/** Strip all HTML tags, returning plain text with collapsed whitespace. */
export function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Encode reserved characters into HTML entities. */
export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => NAMED_ENTITIES[ch] ?? ch);
}

/** Decode common HTML entities back to characters. */
export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&#x0*27;/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/**
 * Minimal Markdown → HTML converter covering headings, bold, italic, links,
 * inline code, fenced code, unordered lists, and paragraphs.
 */
export function markdownToHtml(input: string): EngineResult<string> {
  const escaped = encodeHtmlEntities(input);
  const lines = escaped.split("\n");
  const html: string[] = [];
  let inList = false;
  let inCode = false;

  const inline = (s: string) =>
    s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        html.push("</code></pre>");
        inCode = false;
      } else {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push("<pre><code>");
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      html.push(line);
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      const level = heading[1]!.length;
      html.push(`<h${level}>${inline(heading[2]!)}</h${level}>`);
      continue;
    }

    const listItem = /^[-*+]\s+(.*)$/.exec(line);
    if (listItem) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inline(listItem[1]!)}</li>`);
      continue;
    }

    if (line.trim() === "") {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    html.push(`<p>${inline(line)}</p>`);
  }
  if (inList) html.push("</ul>");
  if (inCode) html.push("</code></pre>");

  return ok(html.join("\n"));
}

/** Convert HTML to plain text (alias for stripHtml with paragraph spacing). */
export function htmlToText(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  const text = input
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return ok(text);
}

/**
 * Parse an HTML table into an array of row objects.
 * Uses the first <tr> in <thead> (or the first <tr>) as headers.
 */
export function htmlTableToRows(
  input: string,
): EngineResult<Record<string, string>[]> {
  if (!input.trim()) return err("Input is empty.");
  const tableMatch = /<table[\s\S]*?<\/table>/i.exec(input);
  const src = tableMatch ? tableMatch[0] : input;

  const trRe = /<tr[\s\S]*?<\/tr>/gi;
  const cellRe = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;

  const rows: string[][] = [];
  let trMatch: RegExpExecArray | null;
  while ((trMatch = trRe.exec(src)) !== null) {
    const cells: string[] = [];
    let cellMatch: RegExpExecArray | null;
    const cellReCopy = new RegExp(cellRe.source, "gi");
    while ((cellMatch = cellReCopy.exec(trMatch[0])) !== null) {
      cells.push(stripHtml(cellMatch[1] ?? "").trim());
    }
    if (cells.length) rows.push(cells);
  }

  if (rows.length < 2)
    return err("Table needs at least a header row and one data row.");
  const headers = rows[0]!;
  const result = rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    return obj;
  });
  return ok(result);
}

/** Convert an HTML table to CSV text. */
export function htmlTableToCsv(input: string): EngineResult<string> {
  const rows = htmlTableToRows(input);
  if (!rows.ok) return rows;
  const headers = Object.keys(rows.value[0] ?? {});
  const lines = [
    headers.map(csvCell).join(","),
    ...rows.value.map((r) => headers.map((h) => csvCell(r[h] ?? "")).join(",")),
  ];
  return ok(lines.join("\n"));
}

function csvCell(v: string): string {
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

/** Convert an HTML table to TSV text. */
export function htmlTableToTsv(input: string): EngineResult<string> {
  const rows = htmlTableToRows(input);
  if (!rows.ok) return rows;
  const headers = Object.keys(rows.value[0] ?? {});
  const lines = [
    headers.join("\t"),
    ...rows.value.map((r) =>
      headers.map((h) => (r[h] ?? "").replace(/\t/g, " ")).join("\t"),
    ),
  ];
  return ok(lines.join("\n"));
}

/** Convert an HTML table to JSON. */
export function htmlTableToJson(input: string): EngineResult<string> {
  const rows = htmlTableToRows(input);
  if (!rows.ok) return rows;
  return ok(JSON.stringify(rows.value, null, 2));
}

/** Convert an HTML table to a simple XML document. */
export function htmlTableToXml(input: string): EngineResult<string> {
  const rows = htmlTableToRows(input);
  if (!rows.ok) return rows;
  const items = rows.value
    .map((r) => {
      const fields = Object.entries(r)
        .map(([k, v]) => `    <${xmlTag(k)}>${escXml(v)}</${xmlTag(k)}>`)
        .join("\n");
      return `  <row>\n${fields}\n  </row>`;
    })
    .join("\n");
  return ok(
    `<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n${items}\n</rows>`,
  );
}

/** Convert an HTML table to YAML. */
export function htmlTableToYaml(input: string): EngineResult<string> {
  const rows = htmlTableToRows(input);
  if (!rows.ok) return rows;
  const lines: string[] = [];
  for (const row of rows.value) {
    lines.push("-");
    for (const [k, v] of Object.entries(row)) {
      lines.push(`  ${k}: ${yamlScalar(v)}`);
    }
  }
  return ok(lines.join("\n"));
}

function xmlTag(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^(\d)/, "_$1") || "field";
}
function escXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function yamlScalar(s: string): string {
  if (/[:#\[\]{},&*!|>'"%@`]/.test(s) || s.includes("\n")) {
    return `"${s.replace(/"/g, '\\"')}"`;
  }
  return s || '""';
}

/** Minimal HTML → Markdown converter. */
export function htmlToMarkdown(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  let md = input
    .replace(
      /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
      (_m, n, t) => `${"#".repeat(Number(n))} ${stripHtml(t)}\n\n`,
    )
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "_$1_")
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "_$1_")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(
      /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
      (_m, c) => `\`\`\`\n${stripHtml(c)}\n\`\`\`\n\n`,
    )
    .replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(
      /<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
      "![$2]($1)",
    )
    .replace(/<img\s+[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return ok(md);
}

// ── BBCode ─────────────────────────────────────────────────────────────────

/** Convert BBCode to HTML. */
export function bbcodeToHtml(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  const html = input
    .replace(/\[b\]([\s\S]*?)\[\/b\]/gi, "<strong>$1</strong>")
    .replace(/\[i\]([\s\S]*?)\[\/i\]/gi, "<em>$1</em>")
    .replace(/\[u\]([\s\S]*?)\[\/u\]/gi, "<u>$1</u>")
    .replace(/\[s\]([\s\S]*?)\[\/s\]/gi, "<s>$1</s>")
    .replace(/\[code\]([\s\S]*?)\[\/code\]/gi, "<pre><code>$1</code></pre>")
    .replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, "<blockquote>$1</blockquote>")
    .replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1">$2</a>')
    .replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '<a href="$1">$1</a>')
    .replace(/\[img\]([\s\S]*?)\[\/img\]/gi, '<img src="$1" alt="" />')
    .replace(
      /\[color=([^\]]+)\]([\s\S]*?)\[\/color\]/gi,
      '<span style="color:$1">$2</span>',
    )
    .replace(
      /\[size=([^\]]+)\]([\s\S]*?)\[\/size\]/gi,
      '<span style="font-size:$1px">$2</span>',
    )
    .replace(
      /\[list\]([\s\S]*?)\[\/list\]/gi,
      (_, c) =>
        `<ul>${c.replace(
          /\[\*\]([\s\S]*?)(?=\[\*\]|$)/gi,
          "<li>$1</li>",
        )}</ul>`,
    )
    .replace(/\n/g, "<br />");
  return ok(html);
}

/** Convert HTML to BBCode. */
export function htmlToBbcode(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  const bb = input
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "[b]$1[/b]")
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "[b]$1[/b]")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "[i]$1[/i]")
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "[i]$1[/i]")
    .replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, "[u]$1[/u]")
    .replace(/<s[^>]*>([\s\S]*?)<\/s>/gi, "[s]$1[/s]")
    .replace(
      /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
      "[code]$1[/code]",
    )
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "[quote]$1[/quote]")
    .replace(
      /<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
      "[url=$1]$2[/url]",
    )
    .replace(/<img\s+[^>]*src="([^"]*)"[^>]*\/?>/gi, "[img]$1[/img]")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
  return ok(bb);
}

// ── PUG / Jade ─────────────────────────────────────────────────────────────

/**
 * Minimal HTML → PUG converter. Handles most common tags; complex HTML may
 * need manual adjustment.
 */
export function htmlToPug(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  try {
    const lines = convertNodeToPug(input, 0);
    return ok(lines.join("\n"));
  } catch (e) {
    return err(e instanceof Error ? e.message : "Conversion failed.");
  }
}

/** pug-to-html: generates HTML from a simplified PUG template. */
export function pugToHtml(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  try {
    const html = parsePugLines(input.split("\n"), 0, 0).html;
    return ok(html);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Invalid PUG.");
  }
}

// jade is an alias for pug
export const jadeToHtml = pugToHtml;
export const htmlToJade = htmlToPug;

// ── Internal PUG helpers ────────────────────────────────────────────────────

function convertNodeToPug(html: string, depth: number): string[] {
  // Strip doctype
  const src = html
    .trim()
    .replace(/<!DOCTYPE[^>]*>/i, "")
    .trim();
  // Simple approach: regex-based tag-by-tag conversion
  const lines: string[] = [];
  const indent = "  ".repeat(depth);
  const tagRe =
    /<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^>]*)?)>([\s\S]*?)<\/\1>|<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^>]*)?)\s*\/>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(src)) !== null) {
    if (m.index > last) {
      const text = src.slice(last, m.index).trim();
      if (text) lines.push(`${indent}| ${text}`);
    }
    if (m[4]) {
      // self-closing
      lines.push(`${indent}${m[4]}${attrsToClass(m[5] ?? "")}`);
    } else {
      const tag = m[1]!;
      const attrsStr = m[2] ?? "";
      const inner = m[3]!.trim();
      const hasChildTags = /<[a-zA-Z]/.test(inner);
      const attrs = attrsToClass(attrsStr);
      if (!hasChildTags && inner) {
        lines.push(`${indent}${tag}${attrs} ${inner.replace(/<[^>]+>/g, "")}`);
      } else {
        lines.push(`${indent}${tag}${attrs}`);
        if (hasChildTags) {
          lines.push(...convertNodeToPug(inner, depth + 1));
        }
      }
    }
    last = m.index + m[0].length;
  }
  if (last < src.length) {
    const text = src.slice(last).trim();
    if (text) lines.push(`${indent}| ${text}`);
  }
  return lines;
}

function attrsToClass(attrsStr: string): string {
  const id = /id="([^"]+)"/.exec(attrsStr);
  const cls = /class="([^"]+)"/.exec(attrsStr);
  let out = "";
  if (id) out += `#${id[1] ?? ""}`;
  if (cls)
    out += (cls[1] ?? "")
      .split(/\s+/)
      .map((c: string) => `.${c}`)
      .join("");
  // remaining attrs
  const remaining = attrsStr
    .replace(/id="[^"]*"/, "")
    .replace(/class="[^"]*"/, "")
    .trim();
  if (remaining) out += `(${remaining.replace(/\s+/g, " ")})`;
  return out;
}

interface PugResult {
  html: string;
  consumed: number;
}

function parsePugLines(
  lines: string[],
  startIdx: number,
  baseIndent: number,
): PugResult {
  let html = "";
  let i = startIdx;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim()) {
      i++;
      continue;
    }
    const indent = line.search(/\S/);
    if (indent < baseIndent) break;
    if (indent > baseIndent) {
      i++;
      continue;
    }
    const content = line.trim();
    if (content.startsWith("| ")) {
      html += content.slice(2);
      i++;
      continue;
    }
    if (content.startsWith("//")) {
      i++;
      continue;
    }
    const m = /^([a-zA-Z][a-zA-Z0-9]*)([#.][^\s(]*)?\(?([^)]*)\)?(.*)$/.exec(
      content,
    );
    if (!m) {
      i++;
      continue;
    }
    const tag = m[1]!;
    const shorthand = m[2] ?? "";
    const attrStr = m[3] ?? "";
    const inline = (m[4] ?? "").trim().replace(/^\s/, "");
    let attrs = parseShorthand(shorthand);
    if (attrStr.trim()) {
      const extra = attrStr
        .split(",")
        .map((a: string) => {
          const [k, ...v] = a.split("=");
          return v.length
            ? `${k!.trim()}="${v
                .join("=")
                .replace(/^["']|["']$/g, "")
                .trim()}"`
            : k!.trim();
        })
        .join(" ");
      attrs += (attrs ? " " : "") + extra;
    }
    const openTag = attrs ? `<${tag} ${attrs}>` : `<${tag}>`;
    const close = `</${tag}>`;
    // check for children
    const nextIndent = i + 1 < lines.length ? lines[i + 1]!.search(/\S/) : -1;
    if (nextIndent > indent) {
      const child = parsePugLines(lines, i + 1, nextIndent);
      html += `${openTag}${inline}${child.html}${close}`;
      i = i + 1 + child.consumed;
    } else {
      html += `${openTag}${inline}${close}`;
      i++;
    }
  }
  return { html, consumed: i - startIdx };
}

function parseShorthand(s: string): string {
  const ids = [...s.matchAll(/#([^.#(]+)/g)].map((m) => m[1]);
  const classes = [...s.matchAll(/\.([^.#(]+)/g)].map((m) => m[1]);
  const parts: string[] = [];
  if (ids.length) parts.push(`id="${ids[0]}"`);
  if (classes.length) parts.push(`class="${classes.join(" ")}"`);
  return parts.join(" ");
}

// ── HTML table generator ───────────────────────────────────────────────────

/**
 * Generate an HTML table from CSV-like text (comma or tab delimited).
 * The first row becomes the <thead>.
 */
export function generateHtmlTable(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  const delimiter = input.includes("\t") ? "\t" : ",";
  const rows = input
    .trim()
    .split("\n")
    .map((r) => r.split(delimiter).map((c) => c.trim()));
  if (rows.length < 1) return err("No data found.");
  const [head, ...body] = rows as [string[], ...string[][]];
  const ths = head.map((h) => `    <th>${escXml(h)}</th>`).join("\n");
  const trs = body
    .map(
      (row) =>
        `  <tr>\n${head
          .map((_, i) => `    <td>${escXml(row[i] ?? "")}</td>`)
          .join("\n")}\n  </tr>`,
    )
    .join("\n");
  return ok(
    `<table>\n  <thead>\n  <tr>\n${ths}\n  </tr>\n  </thead>\n  <tbody>\n${trs}\n  </tbody>\n</table>`,
  );
}
