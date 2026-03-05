import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"
import { ClipRequestSchema, ClipResponseSchema } from "@vole/shared/schemas"
import { clipUrl } from "../scraper/index.js"

export const clipRoute = new OpenAPIHono()

const route = createRoute({
  method: "post",
  path: "/clip",
  request: {
    body: {
      content: { "application/json": { schema: ClipRequestSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: ClipResponseSchema } },
      description: "Clipped page as markdown",
    },
    422: {
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
      description: "Failed to clip URL",
    },
  },
})

clipRoute.openapi(route, async (c) => {
  const { url } = c.req.valid("json")

  try {
    const result = await clipUrl(url)
    return c.json(result, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return c.json({ error: message }, 422)
  }
})
