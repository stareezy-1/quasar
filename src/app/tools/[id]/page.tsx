import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolById, getAllToolIds } from "@/lib/registry";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { SITE_URL } from "@/constants/seo";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Pre-render every tool page at build time → fully static, no server needed. */
export function generateStaticParams() {
  return getAllToolIds().map((id) => ({ id }));
}

/** Per-tool metadata generated from the registry — no per-tool files needed. */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = getToolById(id);
  if (!tool) return { title: "Tool not found" };
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: `${SITE_URL}/tools/${tool.id}` },
    openGraph: {
      title: `${tool.name} — Quasar`,
      description: tool.description,
      url: `${SITE_URL}/tools/${tool.id}`,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { id } = await params;
  if (!getToolById(id)) notFound();
  return <ToolRenderer toolId={id} />;
}
