import { Link } from 'react-router-dom'
import { PageHeader } from '../PageHeader'

const stats = [
  { label: 'Active agents', value: '3', sub: 'across 3 AXL nodes' },
  { label: 'Findings (live)', value: '0', sub: 'CRDT entries' },
  { label: 'Negative results', value: '0', sub: 'preserved' },
  { label: 'Mesh peers', value: '3', sub: 'yggdrasil' },
]

export function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="overview"
        title="Swarm dashboard"
        description="Three specialist auditor agents collaborating over an encrypted P2P mesh. Findings merge into a shared CRDT knowledge graph in real time."
        actions={
          <Link
            to="/audit"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-[var(--color-accent)]/30 transition hover:brightness-110"
          >
            Open audit workspace
          </Link>
        }
      />

      <div className="flex-1 overflow-auto p-8">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elev)] p-4"
            >
              <div className="text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                {s.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-[var(--color-fg-muted)]">
                {s.sub}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AgentCard
            name="Static Analyzer"
            role="Slither / pattern matching"
            description="Extracts flagged patterns and writes findings to the CRDT with source locations and rule IDs."
          />
          <AgentCard
            name="Symbolic / Fuzzer"
            role="Mythril / Echidna"
            description="Explores execution paths, posts counterexamples and reachability claims, prioritizes static-flagged paths."
          />
          <AgentCard
            name="Economic Reasoner"
            role="LLM-driven"
            description="Reasons about incentives, MEV exposure, oracle dependencies, admin key risks."
          />
        </section>
      </div>
    </>
  )
}

function AgentCard({
  name,
  role,
  description,
}: {
  name: string
  role: string
  description: string
}) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg-elev)] p-5">
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />
      <div className="text-sm font-semibold text-white">{name}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
        {role}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        {description}
      </p>
    </article>
  )
}
