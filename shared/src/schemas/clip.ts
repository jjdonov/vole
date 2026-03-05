import { z } from "zod"

export const ClipRequestSchema = z.object({
  url: z.string().url(),
})

export const ClipResponseSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  markdown: z.string(),
  clippedAt: z.number(),
})

export type ClipRequest = z.infer<typeof ClipRequestSchema>
export type ClipResponse = z.infer<typeof ClipResponseSchema>
