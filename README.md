# vole

> Collaborative planning and knowledge boards with offline-first support.

Vole is a collaborative workspace where teams build **plans** and **boards** in markdown. Pages link to each other, backlinks are tracked automatically, and everything works offline first — syncing when you're back online.

---

## Core Concepts

### Plans
Structured documents for organizing goals, tasks, and decisions. Plans are markdown files that can embed links to boards, other plans, and scraped external content.

### Boards
Flexible canvases for grouping and arranging related content. Boards hold cards, links, and embedded pages. Think of them as a visual layer over your markdown content.

### Backlinks
Every page knows what links to it. When you reference a plan or board from another document, a backlink is recorded automatically. This creates a navigable web of related content without any manual upkeep.

### Web Clipping
Paste a URL and Vole will scrape and store the content locally as markdown. Clipped pages become first-class documents — linkable, backlink-tracked, and available offline.

---

## Architecture

### Frontend
- **React 19 + TypeScript** — functional components, concurrent features beneficial for sync state
- **Vite** — fast dev server and ESM-native builds
- **TanStack Router** — type-safe, file-based routing
- **Zustand** — minimal state management alongside Yjs
- **Tailwind CSS v4** — utility-first styling with no runtime overhead

### Editor
- **TipTap v2** (ProseMirror-based) for rich markdown editing
- `@tiptap/extension-collaboration` — first-class Yjs integration for co-editing
- `@tiptap/extension-collaboration-cursor` — live presence cursors per user
- `@tiptap/extension-markdown` — markdown import/export
- Custom extensions for `[[wiki-link]]` syntax and backlink resolution

### Offline First
- **Yjs** as the CRDT engine — conflict-free document model for all user content
- **y-indexeddb** — persists Yjs documents to IndexedDB for offline reads/writes
- **y-websocket** — syncs with the self-hosted server relay when online
- **y-webrtc** — peer-to-peer sync fallback without a central relay
- **Dexie.js** — ergonomic IndexedDB adapter for backlink index, metadata, and clip records

### Collaboration
- Multiple users can edit the same plan or board simultaneously via Yjs CRDTs
- Presence indicators (name, cursor position) via `@tiptap/extension-collaboration-cursor`
- Self-hosted **y-websocket** server acts as the authoritative sync relay

### Backend
- **Node.js** runtime with **Hono** — lightweight, TypeScript-native HTTP framework
- **y-websocket** server for document sync
- **Better Auth** — open-source, self-hosted session-based auth

### Web Scraping / Clipping
- **Playwright** renders JS-heavy pages server-side (avoids CORS, handles SPAs)
- **@mozilla/readability** strips navigation and ads before conversion
- **Cheerio** as a lightweight fallback for static HTML pages
- **Turndown** + `turndown-plugin-gfm` converts cleaned HTML to GFM markdown
- Clipped content is stored as a Yjs document — linkable, backlink-tracked, offline-available

### Backlink Graph
- **remark** (unified ecosystem) parses markdown AST to extract `[[wiki-links]]` and `[label](url)` links
- **remark-wiki-link** handles `[[Page Name]]` syntax
- **gray-matter** parses frontmatter (title, tags, created date)
- Backlink index stored in **Dexie.js** and synced as a `Y.Map` across collaborators
- Updated incrementally on every document save; exposed as a "linked from" panel in the UI

### Simplified Architecture Diagram

```
Browser
├── TipTap Editor ←→ Yjs Doc ←→ y-indexeddb  (offline persistence)
│                               ↕
│                          y-webrtc            (p2p sync fallback)
│                               ↕
└── Dexie.js (backlink index, clip metadata, document metadata)

Server
├── Hono API
│   ├── POST /clip   → Playwright → Readability → Turndown → markdown
│   └── /auth        → Better Auth session management
└── y-websocket      → authoritative document sync relay
```

---

## Project Structure (planned)

Vole is a monorepo managed with **npm workspaces** and **Turborepo**. The frontend and backend are independent packages that deploy to separate targets.

```
vole/
├── app/                  # React 19 + Vite — deploys to Vercel / Cloudflare Pages
│   ├── components/       # Shared UI components (Tailwind)
│   ├── editor/           # TipTap editor, wiki-link extension, backlink panel
│   ├── graph/            # Backlink index (Dexie.js) and graph UI
│   ├── sync/             # Yjs setup, y-indexeddb, y-websocket, y-webrtc providers
│   ├── routes/           # TanStack Router file-based routes
│   └── store/            # Zustand stores for UI state
├── server/               # Node.js + Hono — deploys to Railway / Fly.io (Docker)
│   ├── routes/           # Hono route handlers (clip, auth)
│   ├── scraper/          # Playwright → Readability → Turndown pipeline
│   └── sync/             # y-websocket server setup
├── shared/               # TypeScript types and utilities (not deployed; consumed via TS project references)
├── package.json          # Root workspace (workspaces: ["app", "server", "shared"])
└── turbo.json            # Build pipeline: shared builds first, app and server build in parallel
```

### Release pipelines

Two independent CI/CD jobs, each triggered by path filters:

| Job | Trigger | Deploys to |
|---|---|---|
| `deploy-app` | changes in `app/**` or `shared/**` | Vercel / Cloudflare Pages |
| `deploy-server` | changes in `server/**` or `shared/**` | Railway / Fly.io (container) |

`turbo run build --filter=app...` and `--filter=server...` ensure each job builds only what it needs, including `shared` as a dependency.

---

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Content format | Markdown (GFM + `[[wiki-links]]`) | Portable, readable, version-friendly |
| CRDT engine | **Yjs** | Largest ecosystem, native TipTap integration |
| Editor | **TipTap v2** | Best Yjs + markdown + extensibility combination |
| Local persistence | **y-indexeddb** + **Dexie.js** | Yjs docs in y-indexeddb; metadata/index in Dexie |
| Collaboration transport | **y-websocket** (server) + **y-webrtc** (p2p fallback) | Low-latency, works without central relay |
| Collab backend | Self-hosted **y-websocket** | Data ownership aligns with offline-first philosophy |
| HTTP backend | **Hono** on Node.js | Lightweight, TypeScript-native, edge-compatible |
| Auth | **Better Auth** | Open-source, self-hosted, no vendor lock-in |
| Web clipping | **Playwright** → **Readability** → **Turndown** | Best fidelity for real-world pages including SPAs |
| Backlink parsing | **remark** + **remark-wiki-link** | Unified ecosystem, extensible AST pipeline |
| Frontend build | **Vite** + **TanStack Router** | Fast builds, type-safe routing |
| Monorepo tooling | **npm workspaces** + **Turborepo** | Built into npm 7+, Turborepo handles build order and caching |
| Shared code | **TypeScript project references** | No build step needed; types resolve directly across packages |
| Frontend deploy | **Vercel / Cloudflare Pages** | Static Vite output, free tier, CDN-distributed |
| Backend deploy | **Railway / Fly.io** (Dockerfile) | Always-on Node.js, supports WebSockets |
| Release strategy | Path-filtered CI jobs | `shared/**` changes trigger both pipelines independently |

---

## Getting Started

> Setup instructions will be added as the project is scaffolded.

```bash
# Clone the repo
git clone https://github.com/jjdonov/vole.git
cd vole

# Install dependencies
npm install

# Start the dev server
npm run dev
```

---

## Roadmap

- [ ] Project scaffold (React app + backend)
- [ ] Markdown editor with internal link syntax
- [ ] Local storage and offline read/write
- [ ] Backlink index and UI panel
- [ ] Real-time collaborative editing
- [ ] Web clipping pipeline
- [ ] Sync and conflict resolution
- [ ] Presence and activity indicators
- [ ] Board canvas view
- [ ] Mobile support
