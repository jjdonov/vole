import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">vole</h1>
        <p className="mt-2 text-gray-500">Collaborative planning and knowledge boards.</p>
      </div>
    </main>
  )
}
