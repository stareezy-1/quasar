"use client";

/**
 * CrontabFormatter — parse and explain cron expressions.
 */

import { useCallback, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell } from "@/components/tool-shell";

interface CronField {
  label: string;
  value: string;
  description: string;
}

function explainField(value: string, unit: string, names?: string[]): string {
  if (value === "*") return `Every ${unit}`;
  if (value === "?") return "Any value";
  if (value.startsWith("*/")) {
    const n = value.slice(2);
    return `Every ${n} ${unit}(s)`;
  }
  if (value.includes("-")) {
    const [from, to] = value.split("-");
    const f = names ? names[Number(from)] ?? from : from;
    const t = names ? names[Number(to)] ?? to : to;
    return `From ${f} to ${t}`;
  }
  if (value.includes(",")) {
    const parts = value
      .split(",")
      .map((v) => (names ? names[Number(v)] ?? v : v));
    return `At ${parts.join(", ")}`;
  }
  const named = names ? names[Number(value)] ?? value : value;
  return `At ${unit} ${named}`;
}

const MONTHS = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseCron(expr: string): {
  fields: CronField[];
  next: string[];
  error: string | null;
} {
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    return {
      fields: [],
      next: [],
      error: "Expected 5–6 fields: minute hour day month weekday [year]",
    };
  }
  const [min, hour, dom, month, dow, year] = parts;
  const fields: CronField[] = [
    { label: "Minute", value: min!, description: explainField(min!, "minute") },
    { label: "Hour", value: hour!, description: explainField(hour!, "hour") },
    {
      label: "Day (month)",
      value: dom!,
      description: explainField(dom!, "day"),
    },
    {
      label: "Month",
      value: month!,
      description: explainField(month!, "month", MONTHS),
    },
    {
      label: "Day (week)",
      value: dow!,
      description: explainField(dow!, "weekday", DAYS),
    },
  ];
  if (year)
    fields.push({
      label: "Year",
      value: year,
      description: explainField(year, "year"),
    });

  // Generate next 5 run times (simple approximation)
  const next: string[] = [];
  try {
    let d = new Date();
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + 1);
    let count = 0;
    let attempts = 0;
    while (count < 5 && attempts < 100000) {
      attempts++;
      const m = d.getMinutes(),
        h = d.getHours(),
        dom_ = d.getDate(),
        mo = d.getMonth() + 1,
        dow_ = d.getDay();
      const matchMin = min === "*" || String(m) === min;
      const matchHour = hour === "*" || String(h) === hour;
      const matchDom = dom === "*" || dom === "?" || String(dom_) === dom;
      const matchMonth =
        month === "*" ||
        String(mo) === month ||
        MONTHS.indexOf(month ?? "") === mo;
      const matchDow =
        dow === "*" ||
        dow === "?" ||
        String(dow_) === dow ||
        DAYS.indexOf(dow ?? "") === dow_;
      if (matchMin && matchHour && matchDom && matchMonth && matchDow) {
        next.push(d.toLocaleString());
        count++;
      }
      d.setMinutes(d.getMinutes() + 1);
    }
  } catch {
    /* skip */
  }

  return { fields, next, error: null };
}

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Weekly (Sunday)", value: "0 0 * * 0" },
  { label: "Monthly (1st)", value: "0 0 1 * *" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Weekdays at 9am", value: "0 9 * * 1-5" },
];

export default function CrontabFormatter() {
  const tool = useToolMeta();
  const [expr, setExpr] = useState("*/5 * * * *");
  const { fields, next, error } = parseCron(expr);

  const applyPreset = useCallback((v: string) => setExpr(v), []);

  return (
    <ToolShell title={tool.name} description={tool.description} error={error}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "640px",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button
              key={p.value}
              className="btn btn-secondary"
              style={{ fontSize: "0.8125rem" }}
              onClick={() => applyPreset(p.value)}
            >
              {p.label}
            </button>
          ))}
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
            Cron Expression
          </span>
          <input
            type="text"
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="mono"
            placeholder="* * * * *"
          />
        </label>

        {fields.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {fields.map((f) => (
                <div
                  key={f.label}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {f.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--color-brand)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {f.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {f.description}
                  </div>
                </div>
              ))}
            </div>

            {next.length > 0 && (
              <div style={{ marginTop: "0.5rem" }}>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-text-secondary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Next 5 runs (approx.)
                </div>
                {next.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.875rem",
                      padding: "0.25rem 0",
                      borderBottom: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
