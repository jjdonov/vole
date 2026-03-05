import * as Y from "yjs"
import { IndexeddbPersistence } from "y-indexeddb"
import { WebsocketProvider } from "y-websocket"
import { WebrtcProvider } from "y-webrtc"

export interface SyncProviders {
  doc: Y.Doc
  indexeddb: IndexeddbPersistence
  websocket: WebsocketProvider
  webrtc: WebrtcProvider
  destroy: () => void
}

export function createSyncProviders(documentId: string): SyncProviders {
  const doc = new Y.Doc()

  const indexeddb = new IndexeddbPersistence(documentId, doc)

  const websocket = new WebsocketProvider(
    import.meta.env.VITE_WS_URL ?? "ws://localhost:3000",
    documentId,
    doc
  )

  const webrtc = new WebrtcProvider(documentId, doc)

  return {
    doc,
    indexeddb,
    websocket,
    webrtc,
    destroy() {
      webrtc.destroy()
      websocket.destroy()
      indexeddb.destroy()
      doc.destroy()
    },
  }
}
