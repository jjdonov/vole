declare module "turndown-plugin-gfm" {
  import type TurndownService from "turndown"
  export function gfm(service: TurndownService): void
  export function strikethrough(service: TurndownService): void
  export function tables(service: TurndownService): void
  export function taskListItems(service: TurndownService): void
}

declare module "y-websocket/bin/utils" {
  import type { WebSocket } from "ws"
  import type { IncomingMessage } from "node:http"
  export function setupWSConnection(ws: WebSocket, req: IncomingMessage): void
}
