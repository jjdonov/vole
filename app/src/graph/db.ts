import Dexie, { type Table } from "dexie"
import type { BacklinkEntry, ClipMetadata, Document } from "@vole/shared/types"

class VoleDatabase extends Dexie {
  documents!: Table<Document>
  backlinks!: Table<BacklinkEntry>
  clips!: Table<ClipMetadata>

  constructor() {
    super("vole")
    this.version(1).stores({
      documents: "id, type, updatedAt, *tags",
      backlinks: "[sourceId+targetId], sourceId, targetId",
      clips: "id, documentId, clippedAt",
    })
  }
}

export const db = new VoleDatabase()
