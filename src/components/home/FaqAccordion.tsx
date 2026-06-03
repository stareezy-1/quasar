"use client";

import { useState } from "react";
import type { FaqItem } from "./faq-types";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            style={{
              borderRadius: "0.75rem",
              border: `1px solid ${
                isOpen
                  ? "color-mix(in srgb, var(--color-brand) 30%, transparent)"
                  : "var(--color-border)"
              }`,
              backgroundColor: isOpen
                ? "color-mix(in srgb, var(--color-brand) 4%, var(--color-surface))"
                : "var(--color-surface)",
              overflow: "hidden",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "1.125rem 1.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: isOpen
                    ? "var(--color-brand)"
                    : "var(--color-text-primary)",
                  lineHeight: 1.4,
                  transition: "color 0.2s",
                }}
              >
                {item.q}
              </span>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  border: `1.5px solid ${
                    isOpen ? "var(--color-brand)" : "var(--color-border)"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  color: isOpen
                    ? "var(--color-brand)"
                    : "var(--color-text-muted)",
                  transform: isOpen ? "rotate(45deg)" : "none",
                  transition:
                    "transform 0.22s ease, color 0.2s, border-color 0.2s",
                }}
              >
                +
              </span>
            </button>

            <div
              style={{
                maxHeight: isOpen ? "600px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <p
                style={{
                  padding: "0 1.25rem 1.25rem",
                  fontSize: "0.9375rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
