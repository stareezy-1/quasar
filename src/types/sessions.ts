/**
 * A saved tool session, persisted to localStorage. Stays entirely on-device —
 * no cloud, no account, no upload.
 */
export interface Session {
  /** Unique id. */
  id: string;
  /** The tool this session belongs to (matches `ToolMeta.id`). */
  toolId: string;
  /** User-provided name, or an auto-generated label. */
  name: string;
  /**
   * Input values keyed by pane name (e.g. `input`, `inputB`, `schema`).
   * A generic shape lets every tool persist its own state uniformly.
   */
  inputs: Record<string, string>;
  /** Epoch milliseconds when saved. */
  savedAt: number;
}
