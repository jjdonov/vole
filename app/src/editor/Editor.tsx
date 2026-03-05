import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
import type { SyncProviders } from "../sync/providers"
import type { UserPresence } from "@vole/shared/types"

interface EditorProps {
  sync: SyncProviders
  user: UserPresence
}

export function Editor({ sync, user }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: sync.doc }),
      CollaborationCursor.configure({
        provider: sync.websocket,
        user: { name: user.name, color: user.color },
      }),
    ],
  })

  return <EditorContent editor={editor} className="prose max-w-none p-4" />
}
