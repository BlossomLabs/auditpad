import { PageHeader } from '../PageHeader'

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

interface Finding {
  id: string
  title: string
  severity: Severity
  agent: string
  location: string
  corroborations: number
}

const findings: Finding[] = []

const severityClass: Record<Severity, string> = {
  critical: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
  high: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  medium: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  low: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  info: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30',
}

export function FindingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="knowledge graph"
        title="Findings"
        description="Merged view across all agents. Corroborations collapse duplicate findings; refutations are preserved."
      />

      <div className="flex-1 overflow-auto p-8">
        {findings.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elev)]/40 text-center">
            <div className="text-sm font-medium text-[var(--color-fg)]">
              CRDT is empty
            </div>
            <div className="mt-1 max-w-md text-xs text-[var(--color-fg-muted)]">
              Dispatch agents from the audit workspace to start streaming
              findings. Both positive and negative results will be merged here.
            </div>
          </div>
        ) : (
          <table className="w-full table-fixed border-separate border-spacing-y-2 text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              <tr>
                <th className="px-3 py-2 text-left">Severity</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Agent</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-right">Corroborations</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f) => (
                <tr
                  key={f.id}
                  className="bg-[var(--color-bg-elev)] hover:bg-[var(--color-bg-soft)]"
                >
                  <td className="rounded-l-md px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ring-1 ${severityClass[f.severity]}`}
                    >
                      {f.severity}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-white">{f.title}</td>
                  <td className="px-3 py-3 text-[var(--color-fg-muted)]">
                    {f.agent}
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-[var(--color-fg-muted)]">
                    {f.location}
                  </td>
                  <td className="rounded-r-md px-3 py-3 text-right text-[var(--color-fg-muted)]">
                    {f.corroborations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
