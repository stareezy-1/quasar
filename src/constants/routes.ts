/** App route constants. */

export const ROUTES = {
  HOME: "/",
  TOOLS: "/tools",
  tool: (id: string) => `/tools/${id}`,
} as const;
