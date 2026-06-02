"use client";

/**
 * useStandardTool — convenience hook for the common single-input → single-output
 * tool shape. Combines useToolState (transform + autosave) with useSessions
 * (named saves) and wires a save handler that snapshots the current input.
 */

import { useCallback } from "react";
import type { EngineResult } from "@/types/engines";
import type { Session } from "@/types/sessions";
import { useToolState } from "./useToolState";
import { useSessions } from "./useSessions";

export interface UseStandardToolOptions {
  toolId: string;
  transform: (input: string) => EngineResult<string>;
  initialInput?: string;
  debounce?: number;
}

export function useStandardTool({
  toolId,
  transform,
  initialInput,
  debounce,
}: UseStandardToolOptions) {
  const state = useToolState({ toolId, transform, initialInput, debounce });
  const sessionsApi = useSessions(toolId);

  const save = useCallback(() => {
    const name = window.prompt("Name this session");
    if (name === null) return;
    sessionsApi.save(name, { input: state.input });
  }, [sessionsApi, state.input]);

  const load = useCallback(
    (session: Session) => {
      state.setInput(session.inputs.input ?? "");
    },
    [state],
  );

  return { ...state, sessions: sessionsApi, save, load };
}
