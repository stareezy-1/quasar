/**
 * Shared result types returned by every engine.
 *
 * Engines are pure functions with no React / DOM dependencies. They always
 * return a discriminated result so UI code can render success or error
 * consistently without throwing.
 */

/** A successful engine result carrying an output payload. */
export interface EngineOk<T> {
  ok: true;
  value: T;
}

/** A failed engine result carrying a human-readable message. */
export interface EngineErr {
  ok: false;
  error: string;
  /** Optional 1-based line number where the error occurred. */
  line?: number;
  /** Optional 1-based column number where the error occurred. */
  column?: number;
}

/** The discriminated union every engine returns. */
export type EngineResult<T> = EngineOk<T> | EngineErr;

/** Build a success result. */
export function ok<T>(value: T): EngineOk<T> {
  return { ok: true, value };
}

/** Build an error result. */
export function err(
  error: string,
  position?: { line?: number; column?: number },
): EngineErr {
  return {
    ok: false,
    error,
    line: position?.line,
    column: position?.column,
  };
}

/** Convenience: a string-output engine result. */
export type TextResult = EngineResult<string>;
