/**
 * SEO descriptor for a route. Mirrors the next-gen-portfolio SEO pattern.
 */
export interface RouteDescriptor {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
}

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
}

export interface RobotsConfig {
  rules: RobotsRule[];
  sitemap: string;
}

export type SchemaType =
  | "WebSite"
  | "SoftwareApplication"
  | "WebApplication"
  | "BreadcrumbList";

export interface JsonLd {
  "@context": "https://schema.org";
  "@type": SchemaType;
  [key: string]: unknown;
}
