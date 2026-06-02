"use client";

/**
 * useSessions — manages named saves for a single tool. Wraps the sessions lib
 * with React state so panels re-render on change.
 */

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@/types/sessions";
import {
  deleteSession as deleteSessionLib,
  listSessionsForTool,
  renameSession as renameSessionLib,
  saveSession as saveSessionLib,
} from "@/lib/sessions";

export interface UseSessionsReturn {
  sessions: Session[];
  save: (name: string, inputs: Record<string, string>) => void;
  remove: (id: string) => void;
  rename: (id: string, name: string) => void;
  refresh: () => void;
}

export function useSessions(toolId: string): UseSessionsReturn {
  const [sessions, setSessions] = useState<Session[]>([]);

  const refresh = useCallback(() => {
    setSessions(listSessionsForTool(toolId));
  }, [toolId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    (name: string, inputs: Record<string, string>) => {
      saveSessionLib(toolId, name, inputs);
      refresh();
    },
    [toolId, refresh],
  );

  const remove = useCallback(
    (id: string) => {
      deleteSessionLib(id);
      refresh();
    },
    [refresh],
  );

  const rename = useCallback(
    (id: string, name: string) => {
      renameSessionLib(id, name);
      refresh();
    },
    [refresh],
  );

  return { sessions, save, remove, rename, refresh };
}
