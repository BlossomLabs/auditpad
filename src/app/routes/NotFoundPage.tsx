import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
        404
      </div>
      <div className="text-lg font-semibold text-white">Route not found</div>
      <p className="max-w-sm text-sm text-[var(--color-fg-muted)]">
        That path isn't part of the swarm yet.
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-[var(--color-accent)]/30 transition hover:brightness-110"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
