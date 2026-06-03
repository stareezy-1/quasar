"use client";

/**
 * XPathTester — evaluate XPath expressions against XML documents.
 */

import { useCallback, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, ToolBar } from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { testXPath } from "@/lib/engines/xpath";

const SAMPLE_XML = `<?xml version="1.0"?>
<catalog>
  <book id="bk101">
    <author>Gambardella</author>
    <title>XML Developer Guide</title>
    <price>44.95</price>
  </book>
  <book id="bk102">
    <author>Ralls</author>
    <title>Midnight Rain</title>
    <price>5.95</price>
  </book>
</catalog>`;

export default function XPathTester() {
  const tool = useToolMeta();
  const [xmlInput, setXmlInput] = useState(SAMPLE_XML);
  const [expression, setExpression] = useState("//book/title/text()");
  const [output, setOutput] = useState("");
  const [resultType, setResultType] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    const r = testXPath(xmlInput, expression);
    if (r.ok) {
      const { type, value, nodes } = r.value;
      setResultType(`${type}: ${value}`);
      setOutput(nodes.length ? nodes.join("\n\n") : value);
      setError(null);
    } else {
      setError(r.error);
      setOutput("");
      setResultType("");
    }
  }, [xmlInput, expression]);

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={error}
      toolbar={
        <ToolBar
          output={output}
          downloadName="result.xml"
          onClear={() => {
            setOutput("");
            setError(null);
            setResultType("");
          }}
        />
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            XPath Expression
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              className="mono"
              placeholder="//book/title/text()"
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={run}>
              Run
            </button>
          </div>
        </label>

        {resultType && (
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-brand)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Result: {resultType}
          </p>
        )}

        <div className="tool-two-col">
          <CodeEditor
            label="XML Input"
            value={xmlInput}
            onChange={setXmlInput}
            placeholder="<root>…</root>"
          />
          <CodeEditor
            label="Result"
            value={output}
            onChange={() => {}}
            readOnly
            placeholder="Results appear here…"
          />
        </div>
      </div>
    </ToolShell>
  );
}
