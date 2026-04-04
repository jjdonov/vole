export interface Document {
  id: string
  title: string
  type: "plan" | "board" | "clip"
  createdAt: number
  updatedAt: number
  tags: string[]
}

export interface BacklinkEntry {
  sourceId: string
  targetId: string
  /** The raw link text as it appeared in the source document */
  linkText: string
}

export interface ClipMetadata {
  id: string
  url: string
  title: string
  clippedAt: number
  documentId: string
}

export interface UserPresence {
  userId: string
  name: string
  color: string
}
