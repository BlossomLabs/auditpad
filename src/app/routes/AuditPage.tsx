import { useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { PageHeader } from '../PageHeader'
import { sampleContract } from '../../lib/sampleContract'
import { registerSolidityLanguage } from '../../lib/monacoSolidity'

export function AuditPage() {
  const [code, setCode] = useState(sampleContract)

  const handleMount: OnMount = (_editor, monaco) => {
    registerSolidityLanguage(monaco)
  }

  return (
    <>
      <PageHeader
        eyebrow="workspace"
        title="Vault.sol"
        description="Target contract under audit. Agents will stream findings to the CRDT as they execute."
        actions={
          <>
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
              value={code}
              onChange={(value) => setCode(value ?? '')}
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
            <p className="text-xs leading-relaxed">
              No findings yet. Once the agents are dispatched they will gossip
              CRDT deltas and merged findings will appear here, grouped by
              severity.
            </p>

            <div className="mt-6 space-y-2">
              <SkeletonFinding />
              <SkeletonFinding />
              <SkeletonFinding />
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

function SkeletonFinding() {
  return (
    <div className="rounded-md border border-dashed border-[var(--color-border-soft)] p-3">
      <div className="h-2 w-1/3 rounded bg-[var(--color-bg-soft)]" />
      <div className="mt-2 h-2 w-2/3 rounded bg-[var(--color-bg-soft)]" />
      <div className="mt-1.5 h-2 w-1/2 rounded bg-[var(--color-bg-soft)]" />
    </div>
  )
}
