import { useEffect, useState } from "react"
import * as Y from "yjs"
import { IndexeddbPersistence } from "y-indexeddb"

interface SyncState {
  doc: Y.Doc
  synced: boolean
}

/**
 * Creates a Y.Doc backed by y-indexeddb for the given document ID.
 * Cleans up and recreates when the ID changes.
 */
export function useDocumentSync(documentId: string): SyncState | null {
  const [state, setState] = useState<SyncState | null>(null)

  useEffect(() => {
    const doc = new Y.Doc()
    const persistence = new IndexeddbPersistence(documentId, doc)
    let active = true

    setState({ doc, synced: false })

    persistence.whenSynced.then(() => {
      if (active) setState({ doc, synced: true })
    })

    return () => {
      active = false
      persistence.destroy()
      doc.destroy()
      setState(null)
    }
  }, [documentId])

  return state
}
