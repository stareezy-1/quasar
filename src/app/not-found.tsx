import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "5rem 1.5rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>404</h1>
      <p
        style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}
      >
        That page or tool doesn’t exist.
      </p>
      <Link
        href={ROUTES.HOME}
        style={{
          display: "inline-block",
          padding: "0.625rem 1.25rem",
          borderRadius: "0.5rem",
          backgroundColor: "var(--color-brand)",
          color: "var(--color-on-brand)",
          fontWeight: 700,
        }}
      >
        Back to all tools
      </Link>
    </div>
  );
}
