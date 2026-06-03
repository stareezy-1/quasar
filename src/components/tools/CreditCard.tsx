"use client";

/**
 * CreditCard — validate or generate fake credit card numbers (Luhn algorithm).
 */

import { useCallback, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell, ToolBar } from "@/components/tool-shell";

// ── Luhn ────────────────────────────────────────────────────────────────────
function luhnCheck(n: string): boolean {
  const digits = n.replace(/\D/g, "").split("").map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[digits.length - 1 - i]!;
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function luhnComplete(partial: string): string {
  for (let d = 0; d <= 9; d++) {
    const candidate = partial + d;
    if (luhnCheck(candidate)) return candidate;
  }
  return partial + "0";
}

interface CardType {
  name: string;
  prefix: string;
  length: number;
  icon: string;
}

const CARD_TYPES: CardType[] = [
  { name: "Visa", prefix: "4", length: 16, icon: "💳" },
  { name: "Mastercard", prefix: "5105", length: 16, icon: "💳" },
  { name: "Amex", prefix: "378282", length: 15, icon: "💳" },
  { name: "Discover", prefix: "6011", length: 16, icon: "💳" },
  { name: "JCB", prefix: "3530", length: 16, icon: "💳" },
];

function detectType(n: string): string {
  const d = n.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^5[1-5]/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^6011/.test(d)) return "Discover";
  if (/^35[2-8]/.test(d)) return "JCB";
  return "Unknown";
}

function generateCard(type: CardType): string {
  const remaining = type.length - type.prefix.length - 1;
  let number = type.prefix;
  for (let i = 0; i < remaining; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return luhnComplete(number);
}

function formatCard(n: string): string {
  const d = n.replace(/\D/g, "");
  if (d.length === 15) return d.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
  return d.replace(/(\d{4})/g, "$1 ").trim();
}

export default function CreditCard() {
  const tool = useToolMeta();
  const isValidator = tool.id === "credit-card-validator";

  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    valid: boolean;
    type: string;
    formatted: string;
  } | null>(null);
  const [generated, setGenerated] = useState<
    { type: string; number: string; formatted: string }[]
  >([]);

  const validate = useCallback(() => {
    const n = input.replace(/\D/g, "");
    if (n.length < 13 || n.length > 19) {
      setResult({ valid: false, type: "Unknown", formatted: formatCard(n) });
      return;
    }
    setResult({
      valid: luhnCheck(n),
      type: detectType(n),
      formatted: formatCard(n),
    });
  }, [input]);

  const generate = useCallback(() => {
    setGenerated(
      CARD_TYPES.map((t) => {
        const number = generateCard(t);
        return { type: t.name, number, formatted: formatCard(number) };
      }),
    );
  }, []);

  const output = isValidator
    ? result
      ? `${result.valid ? "✓ VALID" : "✗ INVALID"} · ${result.type} · ${
          result.formatted
        }`
      : ""
    : generated.map((g) => `${g.type}: ${g.formatted}`).join("\n");

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={null}
      toolbar={
        <ToolBar
          output={output}
          downloadName="cards.txt"
          onClear={() => {
            setResult(null);
            setGenerated([]);
            setInput("");
          }}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "480px",
        }}
      >
        {isValidator ? (
          <>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.375rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                }}
              >
                Card Number
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && validate()}
                  className="mono"
                  placeholder="4111 1111 1111 1111"
                  style={{ flex: 1 }}
                  maxLength={23}
                />
                <button className="btn btn-primary" onClick={validate}>
                  Check
                </button>
              </div>
            </label>

            {result && (
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  border: `1px solid ${
                    result.valid ? "var(--color-brand)" : "var(--color-error)"
                  }`,
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: result.valid
                      ? "var(--color-brand)"
                      : "var(--color-error)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {result.valid ? "✓ Valid" : "✗ Invalid"}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {result.type} · {result.formatted}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              className="btn btn-primary"
              onClick={generate}
              style={{ alignSelf: "flex-start" }}
            >
              Generate Numbers
            </button>
            {generated.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  For testing only — not real card numbers.
                </p>
                {generated.map((g) => (
                  <div
                    key={g.type}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.625rem 0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {g.type}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-text-primary)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {g.formatted}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
