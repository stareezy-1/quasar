"use client";

/**
 * JsonPathTester — test JSONPath expressions against JSON documents.
 */

import { useCallback, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, ToolBar } from "@/components/tool-shell";
import { CodeEditor } from "@/components/editors/CodeEditor";
import { testJsonPath } from "@/lib/engines/jsonpath";

const SAMPLE_JSON = `{
  "store": {
    "books": [
      { "title": "Moby Dick", "price": 8.99, "author": "Melville" },
      { "title": "Dune", "price": 12.99, "author": "Herbert" }
    ]
  }
}`;

export default function JsonPathTester() {
  const tool = useToolMeta();
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [path, setPath] = useState("$.store.books[*].title");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(() => {
    const r = testJsonPath(jsonInput, path);
    if (r.ok) {
      setOutput(r.value.json);
      setError(null);
    } else {
      setError(r.error);
      setOutput("");
    }
  }, [jsonInput, path]);

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={error}
      toolbar={
        <ToolBar
          output={output}
          downloadName="result.json"
          onClear={() => {
            setOutput("");
            setError(null);
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
            JSONPath Expression
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              className="mono"
              placeholder="$.store.books[*].title"
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={run}>
              Run
            </button>
          </div>
        </label>

        <div className="tool-two-col">
          <CodeEditor
            label="JSON Input"
            value={jsonInput}
            onChange={setJsonInput}
            placeholder="{}"
          />
          <CodeEditor
            label="Matches"
            value={output}
            onChange={() => {}}
            readOnly
            placeholder="Results will appear here…"
          />
        </div>
      </div>
    </ToolShell>
  );
}
