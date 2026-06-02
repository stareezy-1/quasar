"use client";

/**
 * PasswordGenerator — generate strong random passwords with configurable
 * length and character classes. Uses crypto.getRandomValues for real entropy.
 */

import { useCallback, useEffect, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, Button } from "@/components/tool-shell";
import { copyToClipboard } from "@/lib/utils/io";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

/** Pick `length` characters from `pool` using CSPRNG. */
function generate(length: number, pool: string): string {
  if (!pool) return "";
  const out: string[] = [];
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    out.push(pool[bytes[i]! % pool.length]!);
  }
  return out.join("");
}

export default function PasswordGenerator() {
  const tool = useToolMeta();
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({
    lower: true,
    upper: true,
    digits: true,
    symbols: false,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    const pool =
      (opts.lower ? SETS.lower : "") +
      (opts.upper ? SETS.upper : "") +
      (opts.digits ? SETS.digits : "") +
      (opts.symbols ? SETS.symbols : "");
    setPassword(generate(length, pool));
  }, [length, opts]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  async function handleCopy() {
    if (await copyToClipboard(password)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  const toggle = (key: keyof typeof opts) =>
    setOpts((o) => ({ ...o, [key]: !o[key] }));

  return (
    <ToolShell title={tool.name} description={tool.description}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "640px",
        }}
      >
        <div
          className="mono"
          style={{
            padding: "1.25rem",
            borderRadius: "0.75rem",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "var(--color-brand)",
            wordBreak: "break-all",
            minHeight: "3.5rem",
          }}
        >
          {password || "—"}
        </div>

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
            Length: {length}
          </span>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </label>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {(Object.keys(opts) as (keyof typeof opts)[]).map((key) => (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.875rem",
              }}
            >
              <input
                type="checkbox"
                checked={opts[key]}
                onChange={() => toggle(key)}
                style={{ width: "auto" }}
              />
              {key[0]!.toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button variant="primary" onClick={regenerate}>
            ↻ Regenerate
          </Button>
          <Button onClick={handleCopy} disabled={!password}>
            {copied ? "✓ Copied" : "Copy"}
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
