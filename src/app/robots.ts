import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/seo";

/** Static export requires this for metadata routes. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
