# Quasar ⬡

> All-in-one, privacy-first, offline-capable data & code tools suite.
> Part of the [Stareezy](https://stareezy.tech) ecosystem.

**70+ tools** for JSON, XML, HTML, SQL, CSV, color, units, Base64, and text.
Everything runs in your browser — no upload, no account, no server, works offline.

---

## Tools

### JSON

- Formatter / Validator — prettify, minify, validate with inline errors
- Minifier — compact to single line
- JSON → XML / YAML / CSV conversions
- JSON Diff — semantic key-level diff

### XML

- Formatter / Validator
- XML → JSON / YAML

### CSV / SQL

- CSV → JSON / XML / YAML
- SQL INSERT → JSON / CSV

### HTML

- HTML Stripper
- HTML ↔ Markdown
- Text ↔ HTML Entities

### Color (23 converters)

HEX · RGB · HSL · HSV · CMYK · Colortone — every combination

### Unit (8 converters)

Length · Weight · Volume · Area · Time · Temperature · Speed · Data Storage

### Base64

- Text → Base64
- Base64 → Text

### String

- Case Converter (camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, Sentence case, UPPER, lower, tOGGLE)
- Word Counter (characters, words, lines, sentences, paragraphs)
- Word Frequency Counter
- Reverse String
- Upside Down Text
- Remove Duplicate Lines / Empty Lines / Extra Spaces / Line Breaks / Punctuation
- Sort Text Lines
- String ↔ Hex / Binary encoding

### Utility

- Text Diff (line-by-line)
- Password Generator (CSPRNG, configurable length + character classes)

---

## PWA / Offline

Quasar is a **Progressive Web App** — installable as a desktop or mobile app and
fully functional offline after the first load.

- Service worker (`public/sw.js`) uses a **cache-first** strategy: serves from
  cache instantly, updates in the background
- All tool routes are prerendered at build time and cached on first visit
- All conversion logic is client-side — no network needed for any tool
- Install banner appears automatically on supported browsers (Chrome, Edge, Safari iOS)
- An **Update** toast appears when a new version is deployed

To install: look for the "Add to Home Screen" / "Install" prompt in your browser, or use the browser's install button in the address bar.

---

## Tech stack

| Concern         | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Framework       | Next.js 15 (App Router, `output: "export"`)              |
| Language        | TypeScript 5, strict                                     |
| Styling         | CSS custom properties (aurora/dark/steins-gate palettes) |
| PWA             | Hand-written service worker (no dependency)              |
| Testing         | Vitest + fast-check (property-based)                     |
| Deployment      | Vercel (static)                                          |
| Package manager | pnpm                                                     |

---

## Getting started

```bash
pnpm install
pnpm dev        # → http://localhost:3000
```

## Commands

```bash
pnpm dev        # dev server (run manually in terminal)
pnpm build      # production build → out/
pnpm test       # run all tests once (20 property + unit tests)
pnpm typecheck  # tsc --noEmit
```

---

## Architecture

The core idea is a **tool registry** — the single source of truth for every tool.
Adding a new tool is one entry in `src/lib/registry/tools.ts`. No new route, no
new metadata file, no new sitemap entry. The registry drives everything.

```
quasar/
├── public/
│   ├── sw.js                   ← service worker (cache-first, offline)
│   ├── register-sw.js          ← SW registration + update event
│   └── manifest.webmanifest    ← PWA install metadata
│
├── src/
│   ├── lib/
│   │   ├── registry/           ← Tool registry, search, category metadata
│   │   │   └── tools.ts        ← THE source of truth: 70+ tool entries
│   │   ├── engines/            ← Pure conversion logic (no React, tested)
│   │   │   ├── color/          ← HEX ↔ RGB ↔ HSL ↔ HSV ↔ CMYK ↔ Colortone
│   │   │   ├── data/           ← JSON / YAML / CSV / XML parse + convert
│   │   │   ├── string/         ← case, transform, encode, analyze
│   │   │   ├── unit/           ← length, weight, temp, speed, data, ...
│   │   │   ├── diff/           ← LCS text diff + semantic JSON diff
│   │   │   ├── html/           ← strip, entities, markdown
│   │   │   └── sql/            ← INSERT statement parser
│   │   └── sessions/           ← localStorage autosave + named sessions
│   │
│   ├── hooks/
│   │   ├── useToolState.ts     ← debounced transform + autosave
│   │   ├── useStandardTool.ts  ← toolState + sessions wired together
│   │   └── useSessions.ts      ← CRUD for named saves
│   │
│   ├── components/
│   │   ├── tool-shell/         ← ToolShell, ToolBar, ErrorBanner, StatsBar,
│   │   │                          SessionsPanel, Button (reused by all tools)
│   │   ├── tools/              ← One component per tool (~60 lines each)
│   │   └── home/               ← ToolExplorer (search + category filter)
│   │
│   └── app/
│       ├── page.tsx            ← Home: hero + ToolExplorer
│       ├── tools/page.tsx      ← /tools (same ToolExplorer)
│       └── tools/[id]/page.tsx ← Dynamic tool page (generateStaticParams)
```

### How a tool gets added (three steps)

1. Add an engine function in `src/lib/engines/{category}/`
2. Create a thin React component in `src/components/tools/` using `useStandardTool`
3. Add one entry to `src/lib/registry/tools.ts` with `load: () => import('@/components/tools/MyTool')`

That's it. Routing, SEO, search, sitemap, and the nav all update automatically.

---

## Design system

Inherits the exact visual language from [next-gen-portfolio](https://stareezy.tech):

- CSS custom property palettes: `aurora` (default), `dark`, `steins-gate`
- `data-palette` + `data-theme` attributes on `<html>` — switching is instant, zero re-render
- Pre-paint `ThemeScript` prevents flash of wrong theme
- `ScrollReveal` IntersectionObserver animations
- `--color-brand`, `--color-surface`, `--color-border` etc. — never hardcoded
- `@media (prefers-reduced-motion: reduce)` respected everywhere

---

## Save system

All sessions are stored locally — nothing ever leaves the device.

- **Auto-save**: every tool persists its input to `localStorage` on change (debounced 250ms). Restored on next visit.
- **Named saves**: click "＋ Save" → enter a name → stored in `quasar_sessions`.
- **Sessions panel**: collapsible list per tool — load, rename, or delete.
- **Max 50 sessions**: oldest pruned automatically.
- No cloud, no account, no upload.

---

## Tests

```
__tests__/
├── properties/
│   ├── color-round-trip.property.test.ts   RGB↔HEX/HSL/HSV round-trips
│   ├── data-round-trip.property.test.ts    JSON↔YAML idempotency
│   ├── encode-round-trip.property.test.ts  text↔hex/binary/base64
│   └── unit-converter.property.test.ts     unit conversion round-trips
├── sql-engine.test.ts                      SQL INSERT parser
└── string-engine.test.ts                   case conversion + line transforms
```

Run with `pnpm test`. All 20 tests pass.

---

## Deployment

Deploys to Vercel as a fully static site (`out/` directory). The `vercel.json`
is already configured. Import the repo in the Vercel dashboard — no environment
variables required.

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "out",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

---

## License

MIT — feel free to use, modify, and distribute.

---

_Built by [Bintang](https://stareezy.tech) · Part of the Stareezy ecosystem alongside [Aurora PDF](https://aurora.stareezy.tech) and [@stareezy-ui](https://ui.stareezy.tech)_
