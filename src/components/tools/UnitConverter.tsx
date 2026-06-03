"use client";

/**
 * UnitConverter — single component for every unit category. Maps the tool id
 * (e.g. "length-converter") to a UnitCategory, renders value + from/to
 * dropdowns, and converts live.
 */

import { useMemo, useState } from "react";
import { useToolMeta } from "@/components/tool-shell/ToolContext";
import { ToolShell } from "@/components/tool-shell";
import {
  convertUnit,
  UNIT_CATEGORIES,
  type UnitCategory,
} from "@/lib/engines/unit";

function categoryFromId(id: string): UnitCategory {
  const map: Record<string, UnitCategory> = {
    "length-converter": "length",
    "weight-converter": "weight",
    "volume-converter": "volume",
    "area-converter": "area",
    "time-converter": "time",
    "temperature-converter": "temperature",
    "speed-converter": "speed",
    "data-storage-converter": "data",
    "pressure-converter": "pressure",
    "energy-converter": "energy",
    "angle-converter": "angle",
  };
  return map[id] ?? "length";
}

const selectStyle = { maxWidth: "200px" } as const;

export default function UnitConverter() {
  const tool = useToolMeta();
  const category = useMemo(() => categoryFromId(tool.id), [tool.id]);
  const def = UNIT_CATEGORIES[category];

  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(def.units[0]!.id);
  const [to, setTo] = useState(def.units[1]?.id ?? def.units[0]!.id);

  const result = useMemo(() => {
    const num = Number(value);
    const r = convertUnit(num, from, to, category);
    if (!r.ok) return { text: "—", error: value.trim() ? r.error : null };
    // Trim trailing zeros for readability.
    const rounded = Number(r.value.toFixed(6));
    return { text: String(rounded), error: null };
  }, [value, from, to, category]);

  return (
    <ToolShell
      title={tool.name}
      description={tool.description}
      error={result.error}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "640px",
        }}
      >
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
            Value
          </span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mono"
          />
        </label>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              flex: "1 1 180px",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              From
            </span>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              style={selectStyle}
            >
              {def.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>
          <span
            aria-hidden="true"
            style={{
              paddingBottom: "0.6rem",
              color: "var(--color-text-muted)",
            }}
          >
            →
          </span>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              flex: "1 1 180px",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
              }}
            >
              To
            </span>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              style={selectStyle}
            >
              {def.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          style={{
            padding: "1.25rem",
            borderRadius: "0.75rem",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--color-brand)",
            }}
          >
            {result.text}
          </span>
        </div>
      </div>
    </ToolShell>
  );
}
