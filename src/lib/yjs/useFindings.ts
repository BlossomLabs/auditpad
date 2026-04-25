import { useCallback, useSyncExternalStore } from 'react'

import { yFindings } from './doc'
import type { Finding } from './types'

let cachedSnapshot: Finding[] = yFindings.toArray()

function subscribe(onChange: () => void): () => void {
  const handler = () => {
    cachedSnapshot = yFindings.toArray()
    onChange()
  }
  yFindings.observe(handler)
  return () => yFindings.unobserve(handler)
}

function getSnapshot(): Finding[] {
  return cachedSnapshot
}

export function useFindings(): {
  findings: Finding[]
  addFinding: (finding: Finding) => void
  removeFinding: (id: string) => void
  clearFindings: () => void
} {
  const findings = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const addFinding = useCallback((finding: Finding) => {
    yFindings.push([finding])
  }, [])

  const removeFinding = useCallback((id: string) => {
    const index = yFindings.toArray().findIndex((f) => f.id === id)
    if (index >= 0) yFindings.delete(index, 1)
  }, [])

  const clearFindings = useCallback(() => {
    if (yFindings.length > 0) yFindings.delete(0, yFindings.length)
  }, [])

  return { findings, addFinding, removeFinding, clearFindings }
}
