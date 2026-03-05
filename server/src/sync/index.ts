import { WebSocketServer } from "ws"
import { setupWSConnection } from "y-websocket/bin/utils"
import type { Server } from "node:http"

// @hono/node-server's ServerType is a union; we only use HTTP/1.1 in practice
export function setupSyncServer(httpServer: unknown): void {
  const wss = new WebSocketServer({ server: httpServer as Server, path: "/sync" })

  wss.on("connection", (ws, req) => {
    setupWSConnection(ws, req)
  })

  console.log("Sync server (y-websocket) attached at /sync")
}
