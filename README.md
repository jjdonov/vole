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
- **React** (modern, functional components with hooks)
- **Markdown-first** — all user content is authored and stored as markdown
- Real-time collaborative editing via CRDT-based sync
- Rich link resolution with backlink graph maintained on the client

### Offline First
- All data is stored locally (IndexedDB via a structured adapter)
- Reads and writes work without a network connection
- Changes sync to peers and/or a server when connectivity is restored
- Conflict resolution handled by the CRDT layer — no "who saved last" surprises

### Collaboration
- Multiple users can edit the same plan or board simultaneously
- Presence indicators show who is viewing or editing
- Change history is preserved per document

### Web Scraping / Clipping
- Users submit a URL; the backend fetches and converts the page to markdown
- Clipped content is stored locally and synced like any other document
- External links within clipped content are preserved and resolvable

### Backlink Graph
- Maintained incrementally as documents are created and edited
- Stored locally and synced across collaborators
- Exposed in the UI as a "linked from" panel on every plan and board

---

## Project Structure (planned)

```
vole/
├── app/                  # React application
│   ├── components/       # Shared UI components
│   ├── editor/           # Markdown editor with link resolution
│   ├── graph/            # Backlink graph logic
│   ├── sync/             # Offline-first sync layer (CRDT)
│   └── clipper/          # Web clipping integration
├── server/               # Lightweight backend
│   ├── api/              # REST or GraphQL endpoints
│   └── scraper/          # URL fetch and markdown conversion
└── shared/               # Types and utilities shared by app and server
```

---

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Content format | Markdown | Portable, readable, version-friendly |
| Sync strategy | CRDT (e.g. Yjs or Automerge) | Offline-first, conflict-free merging |
| Local storage | IndexedDB | Large capacity, structured, async |
| Collaboration transport | WebSocket + WebRTC (peer fallback) | Low-latency, works without a central relay |
| Web clipping | Server-side fetch + turndown | Consistent rendering, avoids CORS |

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
