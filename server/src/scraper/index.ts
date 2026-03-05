import { Readability } from "@mozilla/readability"
import * as cheerio from "cheerio"
import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"
import { JSDOM } from "jsdom"
import type { ClipResponse } from "@vole/shared/schemas"

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" })
turndown.use(gfm)

export async function clipUrl(url: string): Promise<ClipResponse> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)

  const html = await res.text()

  // Use Readability for article extraction when possible
  const dom = new JSDOM(html, { url })
  const article = new Readability(dom.window.document).parse()

  let title: string
  let markdown: string

  if (article) {
    title = article.title
    markdown = turndown.turndown(article.content)
  } else {
    // Fallback: Cheerio strips scripts/styles, convert body
    const $ = cheerio.load(html)
    $("script, style, nav, footer, header").remove()
    title = $("title").text() || url
    markdown = turndown.turndown($.html("body") ?? "")
  }

  return {
    id: crypto.randomUUID(),
    url,
    title,
    markdown,
    clippedAt: Date.now(),
  }
}
