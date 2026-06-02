/**
 * HTML utilities — stripping tags, entity encode/decode, and a small
 * Markdown↔HTML converter. These are intentionally dependency-free and operate
 * on strings so they run identically on server and client.
 */

import { type EngineResult, ok } from "@/types/engines";

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
