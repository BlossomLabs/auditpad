import { useEffect, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { MonacoBinding } from 'y-monaco'

import { PageHeader } from '../PageHeader'
import { sampleContract } from '../../lib/sampleContract'
import { registerSolidityLanguage } from '../../lib/monacoSolidity'
import { awareness, yContract } from '../../lib/yjs/doc'
import { useFindings } from '../../lib/yjs/useFindings'
import { usePresence } from '../../lib/yjs/usePresence'
import type { Finding, PresenceUser, Severity } from '../../lib/yjs/types'

const sidebarSeverityClass: Record<Severity, string> = {
  critical: 'bg-rose-500/15 text-rose-300 ring-rose-500/30',
  high: 'bg-orange-500/15 text-orange-300 ring-orange-500/30',
  medium: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  low: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  info: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30',
}

export function AuditPage() {
  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor | null>(null)
  const { findings } = useFindings()
  const peers = usePresence()

  const handleMount: OnMount = (instance, monaco) => {
    registerSolidityLanguage(monaco)
    setEditorInstance(instance)
  }

  useEffect(() => {
    if (!editorInstance) return
    const model = editorInstance.getModel()
    if (!model) return

    if (yContract.length === 0) {
      yContract.insert(0, sampleContract)
    }

    const binding = new MonacoBinding(
      yContract,
      model,
      new Set([editorInstance]),
      awareness,
    )

    return () => {
      binding.destroy()
    }
  }, [editorInstance])

  return (
    <>
      <PageHeader
        eyebrow="workspace"
        title="Vault.sol"
        description="Target contract under audit. Agents will stream findings to the CRDT as they execute."
        actions={
          <>
            <PresenceChips peers={peers} />
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-3 py-1.5 text-sm text-[var(--color-fg-muted)] transition hover:text-white"
            >
              Load contract
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white shadow-sm shadow-[var(--color-accent)]/30 transition hover:brightness-110"
            >
              Dispatch to swarm
            </button>
          </>
        }
      />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col border-r border-[var(--color-border)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elev)]/60 px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-[var(--color-fg-muted)]">
              <span className="font-mono">contracts/Vault.sol</span>
              <span className="text-[var(--color-fg-subtle)]">·</span>
              <span>solidity ^0.8.20</span>
            </div>
            <div className="text-[11px] text-[var(--color-fg-subtle)]">
              read · write · CRDT-linked
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <Editor
              height="100%"
              defaultLanguage="solidity"
              language="solidity"
              defaultValue=""
              onMount={handleMount}
              theme="vs-dark"
              options={{
                fontFamily:
                  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 13,
                lineHeight: 20,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
              }}
            />
          </div>
        </div>

        <aside className="flex w-80 min-h-0 flex-col bg-[var(--color-bg-elev)]/40">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Live findings
          </div>
          <div className="flex-1 overflow-auto px-4 py-3 text-sm text-[var(--color-fg-muted)]">
            {findings.length === 0 ? (
              <p className="text-xs leading-relaxed">
                No findings yet. Once the agents are dispatched they will gossip
                CRDT deltas and merged findings will appear here, grouped by
                severity.
              </p>
            ) : (
              <ul className="space-y-2">
                {findings.map((f) => (
                  <SidebarFinding key={f.id} finding={f} />
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

function SidebarFinding({ finding }: { finding: Finding }) {
  return (
    <li className="rounded-md border border-[var(--color-border-soft)] bg-[var(--color-bg-elev)] p-3">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${sidebarSeverityClass[finding.severity]}`}
        >
          {finding.severity}
        </span>
        <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
          {finding.location}
        </span>
      </div>
      <div className="mt-2 text-xs font-medium text-white">{finding.title}</div>
      <div className="mt-1 text-[11px] text-[var(--color-fg-muted)]">
        {finding.agent}
        {finding.corroborations > 0 && (
          <span className="ml-2 text-[var(--color-fg-subtle)]">
            · {finding.corroborations}× corroborated
          </span>
        )}
      </div>
    </li>
  )
}

function PresenceChips({ peers }: { peers: PresenceUser[] }) {
  if (peers.length === 0) return null
  return (
    <div className="mr-1 flex items-center -space-x-1.5">
      {peers.map((peer) => (
        <span
          key={peer.id}
          title={peer.name}
          className="inline-flex size-7 items-center justify-center rounded-full text-[10px] font-semibold uppercase text-white ring-2 ring-[var(--color-bg)]"
          style={{ backgroundColor: peer.color }}
        >
          {peer.name.slice(0, 2)}
        </span>
      ))}
    </div>
  )
}
