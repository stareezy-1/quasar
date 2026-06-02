"use client";

/**
 * HtmlToMarkdown — convert a useful subset of HTML to Markdown. Lightweight,
 * regex-based; covers headings, bold/italic, links, code, lists, and paragraphs.
 */

import { useCallback } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import {
  ToolShell,
  ToolBar,
  StatsBar,
  SessionsPanel,
} from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useStandardTool } from "@/hooks";
import { ok } from "@/types/engines";
import { decodeHtmlEntities } from "@/lib/engines/html";

function htmlToMarkdown(html: string): string {
  let md = html;
  md = md.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, lvl, inner) => {
    return `\n${"#".repeat(Number(lvl))} ${inner.trim()}\n`;
  });
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");
  md = md.replace(
    /<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    "[$2]($1)",
  );
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<\/(ul|ol)>/gi, "\n");
  md = md.replace(/<(ul|ol)[^>]*>/gi, "\n");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<[^>]+>/g, "");
  md = decodeHtmlEntities(md);
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

export default function HtmlToMarkdown() {
  const tool = useToolMeta();
  const transform = useCallback(
    (input: string) => ok(htmlToMarkdown(input)),
    [],
  );
  const { input, setInput, output, error, clear, sessions, save, load } =
    useStandardTool({ toolId: tool.id, transform });

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={error}
      stats={<StatsBar value={output} />}
      sessions={
        <SessionsPanel
          sessions={sessions.sessions}
          onLoad={load}
          onDelete={sessions.remove}
          onRename={sessions.rename}
        />
      }
      toolbar={
        <ToolBar
          output={output}
          downloadName="output.md"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="HTML"
          value={input}
          onChange={setInput}
          placeholder="<h1>Title</h1><p>Body</p>"
        />
        <CodeEditor
          label="Markdown"
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}
