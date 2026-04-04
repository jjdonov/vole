import { z } from "zod"

export const DocumentTypeSchema = z.enum(["plan", "board", "clip"])

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  type: DocumentTypeSchema,
  tags: z.array(z.string()).default([]),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export type DocumentType = z.infer<typeof DocumentTypeSchema>
