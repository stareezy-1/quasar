import type { Metadata } from "next";
import { ToolExplorer } from "@/components/home/ToolExplorer";
import { SITE_URL } from "@/constants/seo";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Browse and search every Quasar tool by category.",
  alternates: { canonical: `${SITE_URL}/tools` },
};

export default function ToolsPage() {
  return (
    <div
      style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}
    >
      <h1
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          marginBottom: "1.5rem",
        }}
      >
        All Tools
      </h1>
      <ToolExplorer />
    </div>
  );
}
