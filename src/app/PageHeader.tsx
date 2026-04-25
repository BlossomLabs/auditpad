import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-6 border-b border-[var(--color-border)] bg-[var(--color-bg-elev)]/40 px-8 py-6">
      <div>
        {eyebrow && (
          <div className="mb-1 text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            {eyebrow}
          </div>
        )}
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
