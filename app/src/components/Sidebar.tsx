import { Link, useNavigate } from "@tanstack/react-router"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../graph/db"

export function Sidebar() {
  const navigate = useNavigate()
  const documents = useLiveQuery(() => db.documents.orderBy("updatedAt").reverse().toArray(), [])

  async function createDocument() {
    const id = crypto.randomUUID()
    await db.documents.add({
      id,
      title: "",
      type: "plan",
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    navigate({ to: "/doc/$id", params: { id } })
  }

  return (
    <aside className="w-60 flex-shrink-0 border-r border-gray-200 flex flex-col h-full select-none">
      <div className="px-4 h-12 flex items-center justify-between border-b border-gray-200">
        <span className="font-semibold text-gray-900 tracking-tight">vole</span>
        <button
          onClick={createDocument}
          title="New document"
          className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-lg leading-none"
        >
          +
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-1">
        {documents?.length === 0 && (
          <p className="px-4 py-3 text-xs text-gray-400">No documents yet.</p>
        )}
        {documents?.map((doc) => (
          <Link
            key={doc.id}
            to="/doc/$id"
            params={{ id: doc.id }}
            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 truncate"
            activeProps={{ className: "block px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 truncate" }}
          >
            {doc.title || <span className="text-gray-400 italic">Untitled</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
