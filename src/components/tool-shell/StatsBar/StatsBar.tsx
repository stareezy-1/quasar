/** StatsBar — compact character / line / byte counts for a text value. */

export interface StatsBarProps {
  value: string;
}

function byteLength(str: string): number {
  // Accurate UTF-8 byte size.
  return new TextEncoder().encode(str).length;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function StatsBar({ value }: StatsBarProps) {
  const lines = value === "" ? 0 : value.split("\n").length;
  const chars = value.length;
  const bytes = byteLength(value);

  const item = (label: string, n: string) => (
    <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
      <strong style={{ color: "var(--color-text-secondary)" }}>{n}</strong>{" "}
      {label}
    </span>
  );

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {item("lines", String(lines))}
      {item("chars", String(chars))}
      {item("size", formatBytes(bytes))}
    </div>
  );
}
