import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-gray-400">Select a document or create a new one.</p>
    </div>
  )
}
