"use client";

/** Button - small, theme-aware action button used across tool toolbars. */

import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({
  variant = "secondary",
  children,
  style,
  ...rest
}: ButtonProps) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.875rem",
    borderRadius: "0.5rem",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.15s ease, opacity 0.15s ease",
    border: "1px solid var(--color-border)",
    whiteSpace: "nowrap" as const,
  };

  const variants = {
    primary: {
      backgroundColor: "var(--color-brand)",
      color: "var(--color-on-brand)",
      border: "1px solid var(--color-brand)",
    },
    secondary: {
      backgroundColor: "var(--color-surface-elevated)",
      color: "var(--color-text-primary)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--color-text-secondary)",
    },
  } as const;

  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}
