"use client";

/**
 * useToolState — the generic engine that powers every tool.
 *
 * Given a pure `transform(input) => EngineResult<string>`, it manages the
 * input string, runs the transform (debounced), exposes the formatted output
 * or error, and optionally auto-saves/restores the input per tool id.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { EngineResult } from "@/types/engines";
import { useDebouncedValue } from "./useDebouncedValue";
import { readAutosave, writeAutosave } from "@/lib/sessions";

export interface UseToolStateOptions {
  /** Pure transform from input string to an EngineResult. */
  transform: (input: string) => EngineResult<string>;
  /** Initial input value. */
  initialInput?: string;
  /** Debounce delay for running the transform (ms). */
  debounce?: number;
  /** When set, input is auto-saved/restored under this tool id. */
  toolId?: string;
}

export interface UseToolStateReturn {
  input: string;
  setInput: (value: string) => void;
  output: string;
  error: string | null;
  isEmpty: boolean;
  clear: () => void;
}

export function useToolState({
  transform,
  initialInput = "",
  debounce = 250,
  toolId,
}: UseToolStateOptions): UseToolStateReturn {
  const [input, setInput] = useState(initialInput);
  const debouncedInput = useDebouncedValue(input, debounce);

  // Restore autosaved input on mount.
  useEffect(() => {
    if (!toolId) return;
    const saved = readAutosave(toolId);
    if (saved && typeof saved.input === "string") {
      setInput(saved.input);
    }
    // Only on mount per toolId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId]);

  // Persist autosave when the debounced input settles.
  useEffect(() => {
    if (!toolId) return;
    writeAutosave(toolId, { input: debouncedInput });
  }, [toolId, debouncedInput]);

  const { output, error } = useMemo(() => {
    if (debouncedInput.trim() === "") {
      return { output: "", error: null };
    }
    const result = transform(debouncedInput);
    return result.ok
      ? { output: result.value, error: null }
      : { output: "", error: result.error };
  }, [debouncedInput, transform]);

  const clear = useCallback(() => setInput(""), []);

  return {
    input,
    setInput,
    output,
    error,
    isEmpty: input.trim() === "",
    clear,
  };
}
