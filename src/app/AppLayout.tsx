import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/audit', label: 'Audit' },
  { to: '/findings', label: 'Findings' },
]

type AgentStatus = 'online' | 'syncing' | 'offline'

const agents: { name: string; node: string; status: AgentStatus }[] = [
  { name: 'Static Analyzer', node: 'axl-01', status: 'online' },
  { name: 'Symbolic / Fuzzer', node: 'axl-02', status: 'online' },
  { name: 'Economic Reasoner', node: 'axl-03', status: 'syncing' },
]

const statusColor: Record<AgentStatus, string> = {
  online: 'bg-emerald-400',
  syncing: 'bg-amber-400',
  offline: 'bg-rose-400',
}

export function AppLayout() {
  return (
    <div className="grid h-full grid-cols-[260px_1fr] bg-[var(--color-bg)] text-[var(--color-fg)]">
      <aside className="flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-elev)]">
        <div className="flex items-center gap-3 px-5 py-5">
          <Logo />
          <div>
            <div className="text-sm font-semibold leading-tight">auditpad</div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              swarm console
            </div>
          </div>
        </div>

        <nav className="px-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-[var(--color-accent-soft)] text-white'
                        : 'text-[var(--color-fg-muted)] hover:bg-white/5 hover:text-[var(--color-fg)]',
                    ].join(' ')
                  }
                >
                  <span
                    className="size-1.5 rounded-full bg-current opacity-70"
                    aria-hidden
                  />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 px-5">
          <div className="mb-2 text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            AXL nodes
          </div>
          <ul className="flex flex-col gap-2">
            {agents.map((a) => (
              <li
                key={a.node}
                className="flex items-center justify-between rounded-md border border-[var(--color-border-soft)] bg-[var(--color-bg-soft)] px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{a.name}</span>
                  <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
                    {a.node}
                  </span>
                </div>
                <span
                  className={`size-2 rounded-full ${statusColor[a.status]}`}
                  title={a.status}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto border-t border-[var(--color-border)] px-5 py-4 text-[11px] text-[var(--color-fg-subtle)]">
          gensyn · axl mesh · v0.0.1
        </div>
      </aside>

      <main className="flex h-full min-w-0 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

function Logo() {
  return (
    <div
      className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-[var(--color-accent)]/20"
      aria-hidden
    >
      ap
    </div>
  )
}
