"use client";

/**
 * XmlTools — xml-stringify, xml-diff, xml-xsl-transform.
 */

import { useCallback, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import {
  ToolShell,
  ToolBar,
  StatsBar,
  SessionsPanel,
} from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { useStandardTool } from "@/hooks";
import { ok, err, type EngineResult } from "@/types/engines";
import { parseXml, buildXml } from "@/lib/engines/data/xml";
import type { Session } from "@/types/sessions";

// ── xml-stringify ────────────────────────────────────────────────────────────
function xmlStringify(input: string): EngineResult<string> {
  if (!input.trim()) return err("Input is empty.");
  return ok(JSON.stringify(input));
}

// ── xml-diff ─────────────────────────────────────────────────────────────────
function diffLines(a: string, b: string): string {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const result: string[] = [];
  const maxLen = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < maxLen; i++) {
    const la = aLines[i];
    const lb = bLines[i];
    if (la === lb) {
      result.push(`  ${la ?? ""}`);
    } else {
      if (la !== undefined) result.push(`- ${la}`);
      if (lb !== undefined) result.push(`+ ${lb}`);
    }
  }
  return result.join("\n");
}

// ── XSL Transform (browser XSLT) ─────────────────────────────────────────────
function xslTransform(xml: string, xsl: string): EngineResult<string> {
  if (typeof window === "undefined" || !("XSLTProcessor" in window)) {
    return err(
      "XSLT requires a browser environment with XSLTProcessor support.",
    );
  }
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const xslDoc = parser.parseFromString(xsl, "application/xml");
    const xsltProcessor = new (
      window as unknown as { XSLTProcessor: new () => XSLTProcessor }
    ).XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const serializer = new XMLSerializer();
    return ok(serializer.serializeToString(resultDoc));
  } catch (e) {
    return err(e instanceof Error ? e.message : "XSLT transformation failed.");
  }
}

// ── Components ────────────────────────────────────────────────────────────────

function XmlStringifyTool() {
  const tool = useToolMeta();
  const transform = useCallback((input: string) => xmlStringify(input), []);
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
          downloadName="output.txt"
          onClear={clear}
          onSave={save}
        />
      }
    >
      <div className="tool-two-col">
        <CodeEditor
          label="XML Input"
          value={input}
          onChange={setInput}
          placeholder="<root>…</root>"
        />
        <CodeEditor
          label="Stringified"
          value={output}
          onChange={() => {}}
          readOnly
        />
      </div>
    </ToolShell>
  );
}

function XmlDiffTool() {
  const tool = useToolMeta();
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [output, setOutput] = useState("");

  const run = useCallback(() => {
    const a = parseXml(inputA);
    const b = parseXml(inputB);
    if (!a.ok) {
      setOutput(`Error in XML A: ${a.error}`);
      return;
    }
    if (!b.ok) {
      setOutput(`Error in XML B: ${b.error}`);
      return;
    }
    const strA = buildXml(a.value);
    const strB = buildXml(b.value);
    if (!strA.ok || !strB.ok) {
      setOutput("Could not serialize XML.");
      return;
    }
    setOutput(diffLines(strA.value, strB.value));
  }, [inputA, inputB]);

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={null}
      stats={<StatsBar value={output} />}
      toolbar={
        <ToolBar
          output={output}
          downloadName="diff.txt"
          onClear={() => {
            setInputA("");
            setInputB("");
            setOutput("");
          }}
          extra={
            <button className="btn btn-primary" onClick={run}>
              Compare
            </button>
          }
        />
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div className="tool-two-col">
          <CodeEditor
            label="XML A"
            value={inputA}
            onChange={setInputA}
            placeholder="<root>…</root>"
          />
          <CodeEditor
            label="XML B"
            value={inputB}
            onChange={setInputB}
            placeholder="<root>…</root>"
          />
        </div>
        {output && (
          <CodeEditor
            label="Diff"
            value={output}
            onChange={() => {}}
            readOnly
          />
        )}
      </div>
    </ToolShell>
  );
}

function XmlXslTool() {
  const tool = useToolMeta();
  const [xmlInput, setXmlInput] = useState("");
  const [xslInput, setXslInput] = useState(`<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html><body><xsl:apply-templates/></body></html>
  </xsl:template>
  <xsl:template match="*">
    <p><xsl:value-of select="."/></p>
  </xsl:template>
</xsl:stylesheet>`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    const r = xslTransform(xmlInput, xslInput);
    if (r.ok) {
      setOutput(r.value);
      setError(null);
    } else {
      setError(r.error);
      setOutput("");
    }
  }, [xmlInput, xslInput]);

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={error}
      stats={<StatsBar value={output} />}
      toolbar={
        <ToolBar
          output={output}
          downloadName="output.html"
          onClear={() => {
            setOutput("");
            setError(null);
          }}
          extra={
            <button className="btn btn-primary" onClick={run}>
              Transform
            </button>
          }
        />
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div className="tool-two-col">
          <CodeEditor
            label="XML Document"
            value={xmlInput}
            onChange={setXmlInput}
            placeholder="<catalog>…</catalog>"
          />
          <CodeEditor
            label="XSL Stylesheet"
            value={xslInput}
            onChange={setXslInput}
          />
        </div>
        {output && (
          <CodeEditor
            label="Result"
            value={output}
            onChange={() => {}}
            readOnly
          />
        )}
      </div>
    </ToolShell>
  );
}

export default function XmlTools() {
  const tool = useToolMeta();
  if (tool.id === "xml-diff") return <XmlDiffTool />;
  if (tool.id === "xml-xsl-transform") return <XmlXslTool />;
  return <XmlStringifyTool />;
}
