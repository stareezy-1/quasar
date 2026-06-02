/**
 * Session persistence — named saves and per-tool autosave, all in localStorage.
 * Stays entirely on-device.
 */

import type { Session } from "@/types/sessions";
import { readJson, writeJson } from "./storage";

export const SESSIONS_KEY = "quasar_sessions";
export const MAX_SESSIONS = 50;

const autosaveKey = (toolId: string) => `quasar_autosave:${toolId}`;

/** Generate a reasonably unique id without external deps. */
export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Read all named sessions, newest first. */
export function listSessions(): Session[] {
  const all = readJson<Session[]>(SESSIONS_KEY, []);
  return [...all].sort((a, b) => b.savedAt - a.savedAt);
}

/** Read sessions belonging to a single tool. */
export function listSessionsForTool(toolId: string): Session[] {
  return listSessions().filter((s) => s.toolId === toolId);
}

/**
 * Save a new named session. Prunes the oldest entries beyond MAX_SESSIONS.
 * Returns the saved session.
 */
export function saveSession(
  toolId: string,
  name: string,
  inputs: Record<string, string>,
): Session {
  const session: Session = {
    id: createId(),
    toolId,
    name: name.trim() || defaultName(toolId),
    inputs,
    savedAt: Date.now(),
  };
  const all = readJson<Session[]>(SESSIONS_KEY, []);
  all.push(session);
  // Keep only the newest MAX_SESSIONS.
  const pruned = all
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, MAX_SESSIONS);
  writeJson(SESSIONS_KEY, pruned);
  return session;
}

/** Rename an existing session. */
export function renameSession(id: string, name: string): void {
  const all = readJson<Session[]>(SESSIONS_KEY, []);
  const next = all.map((s) =>
    s.id === id ? { ...s, name: name.trim() || s.name } : s,
  );
  writeJson(SESSIONS_KEY, next);
}

/** Delete a session by id. */
export function deleteSession(id: string): void {
  const all = readJson<Session[]>(SESSIONS_KEY, []);
  writeJson(
    SESSIONS_KEY,
    all.filter((s) => s.id !== id),
  );
}

/** Persist autosave state for a tool (separate from named sessions). */
export function writeAutosave(
  toolId: string,
  inputs: Record<string, string>,
): void {
  writeJson(autosaveKey(toolId), inputs);
}

/** Read autosave state for a tool. */
export function readAutosave(toolId: string): Record<string, string> | null {
  return readJson<Record<string, string> | null>(autosaveKey(toolId), null);
}

/** Export every session as a JSON string for download. */
export function exportSessions(): string {
  return JSON.stringify(listSessions(), null, 2);
}

/** Import sessions from a JSON string, merging with existing. */
export function importSessions(json: string): number {
  const parsed = JSON.parse(json) as Session[];
  if (!Array.isArray(parsed)) throw new Error("Invalid sessions file.");
  const existing = readJson<Session[]>(SESSIONS_KEY, []);
  const merged = [...existing, ...parsed]
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, MAX_SESSIONS);
  writeJson(SESSIONS_KEY, merged);
  return parsed.length;
}

function defaultName(toolId: string): string {
  const when = new Date().toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${toolId} — ${when}`;
}
