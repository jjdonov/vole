import { db } from "./db"
import type { BacklinkEntry } from "@vole/shared/types"

/** Regex matching [[wiki-link]] and [[wiki-link|display text]] syntax */
const WIKI_LINK_RE = /\[\[([^\]|]+)(?:\|[^\]]+)?]]/g

/** Extract all wiki-link targets from a markdown string */
export function extractWikiLinks(markdown: string): string[] {
  const targets: string[] = []
  for (const match of markdown.matchAll(WIKI_LINK_RE)) {
    targets.push(match[1].trim())
  }
  return targets
}

/** Rebuild backlinks for a document after it is saved */
export async function updateBacklinks(sourceId: string, markdown: string): Promise<void> {
  const targets = extractWikiLinks(markdown)

  await db.transaction("rw", db.backlinks, async () => {
    await db.backlinks.where("sourceId").equals(sourceId).delete()

    const entries: BacklinkEntry[] = targets.map((t) => ({
      sourceId,
      targetId: t,
      linkText: t,
    }))

    if (entries.length > 0) {
      await db.backlinks.bulkAdd(entries)
    }
  })
}

/** Return all documents that link to the given target */
export function useBacklinksTo(targetId: string) {
  return db.backlinks.where("targetId").equals(targetId).toArray()
}
