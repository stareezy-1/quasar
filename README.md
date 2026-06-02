# Quasar

All-in-one, privacy-first, offline-capable data & code tools suite.
Part of the [Stareezy](https://stareezy.tech) ecosystem.

> **70+ tools** for JSON, XML, HTML, SQL, CSV, color, units, Base64, and text.
> Everything runs in your browser — no upload, no account, works offline.

---

## Features

- **JSON** — formatter, minifier, diff, conversions (XML / YAML / CSV)
- **XML / CSV / SQL** — format and convert between formats
- **HTML** — strip tags, encode/decode entities, Markdown ↔ HTML
- **Color** — 23 converters across HEX, RGB, HSL, HSV, CMYK, Colortone
- **Units** — length, weight, volume, area, time, temperature, speed, data
- **Base64** — encode / decode text
- **String** — case converter, word counter, reverse, upside-down, remove/sort lines, hex/binary encode
- **Diff** — line-by-line text diff and semantic JSON diff
- **Password generator** — CSPRNG, configurable character classes
- **Save system** — auto-save + named sessions, local-only (localStorage)
- **Offline-capable** — static export, PWA manifest
- **Aurora theme** — same palette system as [next-gen-portfolio](https://stareezy.tech)

---

## Tech stack

| Concern         | Choice                                      |
| --------------- | ------------------------------------------- |
| Framework       | Next.js 15 (App Router, static export)      |
| Language        | TypeScript 5, strict                        |
| Styling         | CSS custom properties (no external CSS lib) |
| Testing         | Vitest + fast-check (property-based)        |
| Package manager | pnpm                                        |
| Deployment      | Vercel                                      |

---

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Commands

```bash
pnpm dev        # start dev server (run manually)
pnpm build      # production static export → out/
pnpm test       # run all tests once
pnpm typecheck  # tsc --noEmit
```

## Architecture

The core insight is a **tool registry** (`src/lib/registry/tools.ts`) — the single source of truth for every tool. It drives routing, navigation, search, and SEO automatically. Adding a new tool is one registry entry.

```
src/
├── lib/
│   ├── registry/     # Tool registry + search + category metadata
│   ├── engines/      # Pure conversion functions (no React, fully tested)
│   │   ├── color/    # HEX ↔ RGB ↔ HSL ↔ HSV ↔ CMYK ↔ Colortone
│   │   ├── data/     # JSON / YAML / CSV / XML parse + convert
│   │   ├── string/   # case, transform, encode, analyze
│   │   ├── unit/     # all unit categories
│   │   ├── diff/     # LCS text diff + semantic JSON diff
│   │   ├── html/     # strip, entities, markdown
│   │   └── sql/      # INSERT parser
│   └── sessions/     # localStorage save / restore
├── components/
│   ├── tool-shell/   # ToolShell, ToolBar, ErrorBanner, StatsBar, SessionsPanel
│   ├── tools/        # One component per tool (most are ~60 lines)
│   └── home/         # ToolCard, ToolExplorer (search + filter)
└── hooks/            # useToolState, useSessions, useStandardTool
```

---

## License

MIT
