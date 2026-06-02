/** ErrorBanner — inline parse/validation error display. */

export interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        backgroundColor:
          "color-mix(in srgb, var(--color-error) 12%, transparent)",
        border:
          "1px solid color-mix(in srgb, var(--color-error) 40%, transparent)",
        color: "var(--color-error)",
        fontSize: "0.875rem",
      }}
    >
      <span aria-hidden="true" style={{ fontWeight: 700 }}>
        ⚠
      </span>
      <span className="mono">{message}</span>
    </div>
  );
}
