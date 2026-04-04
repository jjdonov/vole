import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Sidebar } from "../components/Sidebar"

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  ),
})
