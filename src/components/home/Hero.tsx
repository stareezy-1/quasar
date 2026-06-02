"use client";

/**
 * Hero — home page hero section. Inspired by aurora-pdf's floating asset
 * pattern and next-gen-portfolio's lottie decoration approach.
 *
 * Left: badge + headline + description + CTAs + stats
 * Right: floating code/data card with decorative lottie layers
 */

import Link from "next/link";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { LottiePlayer } from "@/components/shared/LottiePlayer";
import { ROUTES } from "@/constants/routes";

export function Hero({ toolCount }: { toolCount: number }) {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(48px, 8vw, 96px) 1.5rem clamp(56px, 8vw, 96px)",
      }}
    >
      {/* ── Background decorations ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          right: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-brand) 12%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Dot-grid overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.25,
          pointerEvents: "none",
        }}
      />

      {/* ── Lottie decorations ────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", right: "2%", bottom: "5%", zIndex: 0 }}
      >
        <LottiePlayer
          src="/lottie/orbit-rings.json"
          width={260}
          height={260}
          opacity={0.12}
          decorative
        />
      </div>
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "1%", top: "8%", zIndex: 0 }}
      >
        <LottiePlayer
          src="/lottie/floating-shapes.json"
          width={200}
          height={200}
          opacity={0.1}
          decorative
        />
      </div>
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "28%", top: "0%", zIndex: 0 }}
      >
        <LottiePlayer
          src="/lottie/stars-sparkle.json"
          width={340}
          height={340}
          opacity={0.14}
          decorative
        />
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "3rem",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left: text */}
        <div
          style={{
            flex: "1 1 400px",
            maxWidth: "560px",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <ScrollReveal variant="fade-down">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                backgroundColor:
                  "color-mix(in srgb, var(--color-brand) 10%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--color-brand) 25%, transparent)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--color-brand)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                width: "fit-content",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-brand)",
                  boxShadow: "0 0 8px var(--color-brand)",
                  display: "inline-block",
                  animation: "pulse-glow 2s ease-in-out infinite",
                }}
              />
              Free · Privacy-first · Offline
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={1}>
            <h1
              id="hero-heading"
              style={{
                fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              <span className="shimmer-text">All-in-One</span>
              <br />
              Data &amp; Code Tools
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={2}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)",
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {toolCount}+ tools for{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                JSON
              </strong>
              ,{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                XML
              </strong>
              ,{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                color
              </strong>
              ,{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                units
              </strong>
              ,{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                HTML
              </strong>
              , and more. Everything runs in your browser — no upload, no
              account.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={3}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link
                href={ROUTES.TOOLS}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--color-brand)",
                  color: "var(--color-background)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  boxShadow:
                    "0 4px 20px color-mix(in srgb, var(--color-brand) 30%, transparent)",
                }}
              >
                Browse {toolCount}+ tools →
              </Link>
              <Link
                href={ROUTES.tool("json-formatter")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--color-border)",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-surface) 80%, transparent)",
                  color: "var(--color-text-primary)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  backdropFilter: "blur(8px)",
                }}
              >
                Try JSON Formatter
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal variant="fade-up" delay={4}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {[
                { value: `${toolCount}+`, label: "Tools" },
                { value: "100%", label: "Client-side" },
                { value: "0", label: "Uploads" },
                { value: "0", label: "Accounts" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "var(--color-brand)",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Right: floating data card */}
        <ScrollReveal variant="zoom" delay={2}>
          <FloatingDataCard />
        </ScrollReveal>
      </div>
    </section>
  );
}

/** Decorative floating card mimicking aurora-pdf's style — no real tool logic. */
function FloatingDataCard() {
  return (
    <div
      aria-hidden="true"
      className="hero-float"
      style={{ position: "relative", width: "300px", flexShrink: 0 }}
    >
      {/* Glow behind card */}
      <div
        style={{
          position: "absolute",
          inset: "-40px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-brand) 15%, transparent) 0%, transparent 70%)",
          animation: "pulse-glow 3s ease-in-out infinite",
        }}
      />
      {/* Card shadow layer */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "-8px",
          bottom: "-8px",
          backgroundColor: "var(--color-surface-elevated)",
          borderRadius: "1.25rem",
          border: "1px solid var(--color-border)",
          transform: "rotate(3deg)",
        }}
      />
      {/* Main card */}
      <div
        style={{
          position: "relative",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow:
            "0 24px 64px color-mix(in srgb, var(--color-background) 60%, transparent)",
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            backgroundColor: "var(--color-surface-elevated)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: c,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "0.4rem",
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
            }}
          >
            quasar.json
          </span>
          {/* Lottie inside card */}
          <div style={{ marginLeft: "auto" }}>
            <LottiePlayer
              src="/lottie/wave-lines.json"
              width={48}
              height={20}
              opacity={0.5}
              decorative
            />
          </div>
        </div>
        {/* JSON content */}
        <div
          className="mono"
          style={{
            padding: "1.25rem",
            fontSize: "0.8125rem",
            lineHeight: 1.8,
          }}
        >
          <div>
            <span style={{ color: "#f59e0b" }}>{"{"}</span>
          </div>
          {[
            { k: "name", v: '"quasar"', vc: "#34d399" },
            { k: "tools", v: '"70+"', vc: "#34d399" },
            { k: "offline", v: "true", vc: "var(--color-brand)" },
            { k: "upload", v: "false", vc: "var(--color-error)" },
            { k: "account", v: "false", vc: "var(--color-error)" },
          ].map(({ k, v, vc }) => (
            <div key={k} style={{ paddingLeft: "1.25rem" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>
                "{k}"
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>: </span>
              <span style={{ color: vc }}>{v}</span>
              <span style={{ color: "var(--color-text-muted)" }}>,</span>
            </div>
          ))}
          <div>
            <span style={{ color: "#f59e0b" }}>{"}"}</span>
          </div>
          <div style={{ marginTop: "0.375rem" }}>
            <span style={{ color: "var(--color-text-muted)" }}>{"// "}</span>
            <span style={{ color: "var(--color-text-muted)" }}>ready</span>
            <span
              className="cursor-blink"
              style={{ color: "var(--color-brand)", marginLeft: "2px" }}
            >
              |
            </span>
          </div>
        </div>
      </div>

      {/* Floating pill — top right */}
      <div
        style={{
          position: "absolute",
          top: "-0.75rem",
          right: "-0.75rem",
          backgroundColor: "var(--color-brand)",
          color: "var(--color-background)",
          borderRadius: "0.625rem",
          padding: "0.4rem 0.75rem",
          fontSize: "0.75rem",
          fontWeight: 700,
          boxShadow:
            "0 4px 14px color-mix(in srgb, var(--color-brand) 40%, transparent)",
        }}
      >
        Offline ✓
      </div>

      {/* Floating pill — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "-0.75rem",
          left: "-0.75rem",
          backgroundColor: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.625rem",
          padding: "0.4rem 0.875rem",
          fontSize: "0.8125rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          boxShadow:
            "0 4px 14px color-mix(in srgb, var(--color-background) 50%, transparent)",
        }}
      >
        <span style={{ color: "var(--color-brand)" }}>⬡</span>
        <span style={{ color: "var(--color-text-primary)" }}>Zero upload</span>
      </div>
    </div>
  );
}
