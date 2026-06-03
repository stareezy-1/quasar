import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import { SITE_URL } from "@/constants/seo";
import { ROUTES } from "@/constants/routes";
import { FaqAccordion } from "@/components/home/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — Quasar",
  description:
    "Frequently asked questions about Quasar — privacy, offline support, how tools work, and more.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

const FAQS: FaqItem[] = [
  {
    q: "Is Quasar really free?",
    a: "Yes, completely. There's no free tier, no paid plan, no sign-up. Every tool is free forever.",
  },
  {
    q: "Does Quasar upload my data anywhere?",
    a: "No. Every tool runs entirely in your browser using JavaScript. Your text, files, and data never leave your device. There is no server-side processing.",
  },
  {
    q: "Do I need an account?",
    a: "No account, no email, no sign-in. Open the site, use the tool, close the tab. That's it.",
  },
  {
    q: "Does Quasar work offline?",
    a: "Yes. After your first visit, Quasar is cached by a service worker. You can use every tool without an internet connection. The app also installs as a PWA on mobile and desktop.",
  },
  {
    q: "How does the save system work?",
    a: "Sessions are saved to your browser's localStorage — entirely on your device. There is no cloud sync. Auto-save keeps your last input per tool, and you can create named saves via the Save button inside any tool. Up to 50 named sessions are stored.",
  },
  {
    q: "What data formats are supported?",
    a: "JSON, YAML, XML, CSV, TSV, and SQL INSERT statements. You can convert between any of these, format/validate them, and diff them.",
  },
  {
    q: "Which color formats are supported?",
    a: "HEX, RGB, HSL, HSV, CMYK, and CSS named colors. Every combination is available — 30 converters total.",
  },
  {
    q: "Which unit categories are available?",
    a: "Length, weight/mass, volume, area, time, temperature, speed, and data storage. More are planned.",
  },
  {
    q: "Can I use Quasar on mobile?",
    a: 'Yes. The layout is responsive and every tool works on small screens. On iOS Safari or Chrome for Android, tap "Add to Home Screen" to install it as a standalone app.',
  },
  {
    q: "Does Quasar use any tracking or analytics?",
    a: "No tracking, no analytics, no cookies, no third-party scripts. The page is purely static HTML, CSS, and JavaScript.",
  },
  {
    q: "I found a bug or want to request a tool. How do I contact you?",
    a: (
      <>
        Open an issue on{" "}
        <a
          href="https://github.com/stareezy-1/quasar"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-brand)", fontWeight: 600 }}
        >
          GitHub
        </a>{" "}
        or reach out via{" "}
        <a
          href="https://stareezy.tech/contact"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-brand)", fontWeight: 600 }}
        >
          stareezy.tech/contact
        </a>
        .
      </>
    ),
  },
  {
    q: "Who built Quasar?",
    a: (
      <>
        Quasar was built by{" "}
        <a
          href="https://stareezy.tech"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-brand)", fontWeight: 600 }}
        >
          Bintang (stareezy.tech)
        </a>{" "}
        — a front-end &amp; mobile engineer. Part of the Stareezy ecosystem
        alongside{" "}
        <a
          href="https://aurora.stareezy.tech"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-brand)", fontWeight: 600 }}
        >
          Aurora PDF
        </a>{" "}
        and{" "}
        <a
          href="https://ui.stareezy.tech"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-brand)", fontWeight: 600 }}
        >
          @stareezy-ui
        </a>
        .
      </>
    ),
  },
  {
    q: "Is the source code available?",
    a: (
      <>
        Yes — open source on{" "}
        <a
          href="https://github.com/stareezy-1/quasar"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-brand)", fontWeight: 600 }}
        >
          github.com/stareezy-1/quasar
        </a>{" "}
        under the MIT license.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{ marginBottom: "2rem", fontSize: "0.8125rem" }}
      >
        <Link href={ROUTES.HOME} style={{ color: "var(--color-text-muted)" }}>
          Home
        </Link>
        <span style={{ color: "var(--color-text-muted)", margin: "0 0.4rem" }}>
          /
        </span>
        <span style={{ color: "var(--color-text-secondary)" }}>FAQ</span>
      </nav>

      <header style={{ marginBottom: "2.5rem" }}>
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
            marginBottom: "1rem",
          }}
        >
          Frequently Asked Questions
        </div>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          Got questions?
        </h1>
        <p
          style={{
            color: "var(--color-text-secondary)",
            marginTop: "0.625rem",
            fontSize: "1rem",
            lineHeight: 1.7,
          }}
        >
          Everything you need to know about how Quasar works, what it stores,
          and who built it.
        </p>
      </header>

      <FaqAccordion items={FAQS} />

      {/* CTA */}
      <div
        style={{
          marginTop: "3rem",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          border:
            "1px solid color-mix(in srgb, var(--color-brand) 25%, transparent)",
          backgroundColor:
            "color-mix(in srgb, var(--color-brand) 6%, transparent)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "1rem",
            fontSize: "0.9375rem",
          }}
        >
          Ready to try it out?
        </p>
        <Link
          href={ROUTES.TOOLS}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.625rem 1.25rem",
            borderRadius: "0.5rem",
            backgroundColor: "var(--color-brand)",
            color: "var(--color-background)",
            fontWeight: 700,
            fontSize: "0.9375rem",
            textDecoration: "none",
          }}
        >
          Browse all tools →
        </Link>
      </div>
    </div>
  );
}
