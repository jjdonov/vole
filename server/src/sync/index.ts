import { WebSocketServer } from "ws"
import { setupWSConnection } from "y-websocket/bin/utils"
import type { Server } from "node:http"

export function setupSyncServer(httpServer: Server): void {
  const wss = new WebSocketServer({ server: httpServer, path: "/sync" })

  wss.on("connection", (ws, req) => {
    setupWSConnection(ws, req)
  })

  console.log("Sync server (y-websocket) attached at /sync")
}
