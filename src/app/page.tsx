import type { Metadata } from "next";
import { ToolExplorer } from "@/components/home/ToolExplorer";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Hero } from "@/components/home/Hero";
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
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero toolCount={TOOL_COUNT} />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        <ToolExplorer />
      </div>
    </div>
  );
}
