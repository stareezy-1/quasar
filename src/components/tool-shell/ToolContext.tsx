"use client";

/**
 * ToolContext - provides the active ToolMeta to generic tool components so a
 * single component (e.g. ColorConverter) can self-configure from the tool id
 * (e.g. "hex-to-rgb").
 */

import { createContext, useContext, type ReactNode } from "react";
import type { ToolMeta } from "@/types/tool";

const ToolContext = createContext<ToolMeta | null>(null);

export function ToolProvider({
  tool,
  children,
}: {
  tool: ToolMeta;
  children: ReactNode;
}) {
  return <ToolContext.Provider value={tool}>{children}</ToolContext.Provider>;
}

/** Read the active tool meta. Throws if used outside a ToolProvider. */
export function useToolMeta(): ToolMeta {
  const ctx = useContext(ToolContext);
  if (!ctx) throw new Error("useToolMeta must be used within a ToolProvider");
  return ctx;
}
