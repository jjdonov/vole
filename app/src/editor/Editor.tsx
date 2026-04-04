import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Collaboration from "@tiptap/extension-collaboration"
import { Markdown } from "tiptap-markdown"
import type * as Y from "yjs"

interface EditorProps {
  doc: Y.Doc
}

export function Editor({ doc }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Markdown,
      Collaboration.configure({ document: doc }),
    ],
  })

  return (
    <EditorContent
      editor={editor}
      className="prose prose-gray max-w-none px-8 py-4 min-h-full outline-none"
    />
  )
}
