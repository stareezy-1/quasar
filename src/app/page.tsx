import type { Metadata } from "next";
import { ToolExplorer } from "@/components/home/ToolExplorer";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { TOOL_COUNT } from "@/lib/registry";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Quasar — All-in-One Data & Code Tools",
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function HomePage() {
  return (
    <div
      style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ScrollReveal variant="fade-up">
        <section style={{ textAlign: "center", padding: "2rem 0 2.5rem" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}
          >
            <span className="shimmer-text">All-in-One</span> Data &amp; Code
            Tools
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)",
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {TOOL_COUNT}+ privacy-first tools for JSON, XML, HTML, SQL, CSV,
            color, units, Base64, and text. Everything runs in your browser — no
            upload, no account, works offline.
          </p>
        </section>
      </ScrollReveal>

      <ToolExplorer />
    </div>
  );
}
