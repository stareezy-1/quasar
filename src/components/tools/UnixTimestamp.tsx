"use client";

/**
 * UnixTimestamp — bidirectional Unix timestamp ↔ date/time converter.
 */

import { useState, useCallback } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell } from "@/components/tool-shell";
import {
  unixToDate,
  dateToUnix,
  type TimestampResult,
} from "@/lib/engines/unit/timestamp";

const ROW = {
  display: "flex",
  gap: "0.5rem",
  alignItems: "baseline",
  flexWrap: "wrap" as const,
};
const LABEL = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--color-text-secondary)",
  minWidth: "90px",
};
const VALUE = {
  fontFamily: "var(--font-mono)",
  color: "var(--color-text-primary)",
};

export default function UnixTimestamp() {
  const tool = useToolMeta();
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState<TimestampResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const now = useCallback(() => {
    const r = unixToDate(String(Math.floor(Date.now() / 1000)));
    if (r.ok) {
      setResult(r.value);
      setTsInput(String(r.value.unix));
      setError(null);
    }
  }, []);

  const convertTs = useCallback(() => {
    const r = unixToDate(tsInput);
    if (r.ok) {
      setResult(r.value);
      setError(null);
    } else {
      setError(r.error);
      setResult(null);
    }
  }, [tsInput]);

  const convertDate = useCallback(() => {
    const r = dateToUnix(dateInput);
    if (r.ok) {
      setResult(r.value);
      setTsInput(String(r.value.unix));
      setError(null);
    } else {
      setError(r.error);
      setResult(null);
    }
  }, [dateInput]);

  return (
    <ToolShell title={tool.name} description={tool.description} error={error}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "600px",
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={now}
          style={{ alignSelf: "flex-start" }}
        >
          Use Current Time
        </button>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              flex: "1 1 200px",
            }}
          >
            <span style={LABEL}>Unix Timestamp</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="number"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                className="mono"
                placeholder="1717228800"
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={convertTs}>
                →
              </button>
            </div>
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              flex: "1 1 260px",
            }}
          >
            <span style={LABEL}>Date / Time String</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="mono"
                placeholder="2024-06-01T12:00:00Z"
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={convertDate}>
                →
              </button>
            </div>
          </label>
        </div>

        {result && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            {(
              [
                ["Unix", String(result.unix)],
                ["ISO 8601", result.iso],
                ["UTC", result.utc],
                ["Local", result.local],
                ["Relative", result.relative],
              ] as [string, string][]
            ).map(([label, val]) => (
              <div key={label} style={ROW}>
                <span style={LABEL}>{label}</span>
                <span style={VALUE}>{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
