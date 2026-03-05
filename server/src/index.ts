import { serve } from "@hono/node-server"
import { OpenAPIHono } from "@hono/zod-openapi"
import { clipRoute } from "./routes/clip.js"
import { setupSyncServer } from "./sync/index.js"

const app = new OpenAPIHono()

app.route("/api", clipRoute)

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: { title: "Vole API", version: "0.0.0" },
})

const port = Number(process.env.PORT ?? 3001)

const server = serve({ fetch: app.fetch, port }, () => {
  console.log(`API server running on http://localhost:${port}`)
})

setupSyncServer(server)
