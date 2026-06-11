"use client";

/**
 * Hero — home page hero.
 *
 * Direction: "Quasar" is a blazing plasma jet from a galactic core, so the
 * identity earns a confident orange + crimson duo on a tinted ember-black.
 * The hero states what the suite does, with a monospace spec rail and one
 * deliberate accretion-disk Lottie as the single orchestrated motion moment.
 * No shimmer gradient text, no fake JSON window built from divs.
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
        padding: "clamp(56px, 9vw, 104px) 1.5rem clamp(48px, 7vw, 88px)",
      }}
    >
      {/* Single soft brand glow, top-right (one, not three) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "640px",
          height: "640px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-brand) 12%, transparent) 0%, transparent 62%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "3.5rem",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left: text */}
        <div
          style={{
            flex: "1 1 440px",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Mono spec rail */}
          <ScrollReveal variant="fade-up">
            <ul
              aria-label="At a glance"
              style={{
                listStyle: "none",
                margin: 0,
                padding: "0 0 0 1rem",
                borderLeft: "2px solid var(--color-brand)",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.8125rem",
              }}
            >
              {[
                { k: "tools", v: `${toolCount}+ data & code utilities` },
                { k: "runtime", v: "your browser, fully offline" },
                { k: "cost", v: "free, no account, no upload" },
              ].map((r) => (
                <li
                  key={r.k}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      minWidth: "4rem",
                    }}
                  >
                    {r.k}
                  </span>
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    {r.v}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal variant="fade-up" delay={1}>
            <h1
              id="hero-heading"
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "clamp(2.25rem, 6vw, 4rem)",
                fontWeight: 600,
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                margin: 0,
                color: "var(--color-text-primary)",
              }}
            >
              Every dev tool you{" "}
              <span style={{ color: "var(--color-brand)" }}>reach for</span>, in
              one tab.
            </h1>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal variant="fade-up" delay={2}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "clamp(1rem, 1.5vw, 1.1875rem)",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: "52ch",
              }}
            >
              Format JSON, convert XML, pick colors, diff text, encode, and
              more. {toolCount}+ utilities that run entirely in your browser.
              Nothing is uploaded, nothing is tracked.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal variant="fade-up" delay={3}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link
                href={ROUTES.TOOLS}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.8125rem 1.75rem",
                  borderRadius: "8px",
                  backgroundColor: "var(--color-brand)",
                  color: "var(--color-on-brand)",
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
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
                  padding: "0.8125rem 1.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "transparent",
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-display), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                }}
              >
                Open JSON Formatter
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal variant="fade-up" delay={4}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              {[
                { value: `${toolCount}+`, label: "Tools" },
                { value: "100%", label: "Client-side" },
                { value: "0", label: "Uploads" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display), sans-serif",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: "var(--color-brand)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontFamily: "var(--font-mono), monospace",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Right: the single orchestrated motion moment — accretion disk */}
        <ScrollReveal variant="zoom" delay={2}>
          <div
            aria-hidden="true"
            style={{
              position: "relative",
              width: "clamp(240px, 34vw, 360px)",
              aspectRatio: "1 / 1",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LottiePlayer
              src="/lottie/quasar-accretion.json"
              width={360}
              height={360}
              opacity={0.9}
              decorative
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
