import { createFileRoute } from "@tanstack/react-router"
import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useRef, useState } from "react"
import { Editor } from "../editor/Editor"
import { useDocumentSync } from "../editor/useDocumentSync"
import { db } from "../graph/db"

export const Route = createFileRoute("/doc/$id")({
  component: DocumentPage,
})

function DocumentPage() {
  const { id } = Route.useParams()
  const meta = useLiveQuery(() => db.documents.get(id), [id])
  const sync = useDocumentSync(id)

  const [title, setTitle] = useState("")
  const titleRef = useRef<HTMLInputElement>(null)

  // Sync local title state when Dexie record loads
  useEffect(() => {
    if (meta) setTitle(meta.title)
  }, [meta?.title])

  async function saveTitle() {
    const trimmed = title.trim()
    await db.documents.update(id, { title: trimmed, updatedAt: Date.now() })
  }

  if (!meta) return null

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-2">
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              titleRef.current?.blur()
            }
          }}
          placeholder="Untitled"
          className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 outline-none bg-transparent"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {sync?.synced ? (
          <Editor doc={sync.doc} />
        ) : (
          <div className="px-8 py-4 text-sm text-gray-400">Loading…</div>
        )}
      </div>
    </div>
  )
}
