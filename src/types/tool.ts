import type { ComponentType } from "react";

/**
 * Tool category — groups tools in navigation, the home grid, and search.
 */
export type ToolCategory =
  | "json"
  | "xml"
  | "html"
  | "sql"
  | "csv"
  | "color"
  | "unit"
  | "base64"
  | "image"
  | "string"
  | "utility";

/**
 * Metadata describing a single tool. This is the single source of truth that
 * drives routing (`/tools/[id]`), navigation, search, and SEO.
 *
 * The `load` field lazily imports the tool's React component so the home page
 * and registry stay lightweight — only the visited tool's code is loaded.
 */
export interface ToolMeta {
  /** kebab-case slug. Used as the route param: `/tools/{id}`. */
  id: string;
  /** Display name shown in cards, breadcrumbs, and page titles. */
  name: string;
  /** One-line description used in SEO metadata and search results. */
  description: string;
  /** Category grouping. */
  category: ToolCategory;
  /** Search keywords for fuzzy matching. */
  keywords: string[];
  /** Emoji or short glyph used as the tool's icon. */
  icon: string;
  /** Lazy loader for the tool's React component. */
  load: () => Promise<{ default: ComponentType }>;
}

/**
 * Display metadata for a category (label, description, icon, accent color).
 */
export interface CategoryMeta {
  id: ToolCategory;
  label: string;
  description: string;
  icon: string;
  /** CSS color value used as the accent for this category's cards. */
  accent: string;
}
