import { useSyncExternalStore } from 'react'

import { awareness } from './doc'
import type { PresenceUser } from './types'

const ANIMALS = [
  'otter',
  'falcon',
  'lemur',
  'badger',
  'heron',
  'jackal',
  'narwhal',
  'octopus',
  'pangolin',
  'quokka',
  'raven',
  'salamander',
] as const

const COLORS = [
  '#f97316',
  '#22d3ee',
  '#a855f7',
  '#facc15',
  '#10b981',
  '#ef4444',
  '#3b82f6',
  '#ec4899',
] as const

const STORAGE_KEY = 'auditpad.user'

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function loadOrCreateUser(): { name: string; color: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { name: string; color: string }
      if (parsed?.name && parsed?.color) return parsed
    }
  } catch {
    // ignore corrupted storage; fall through to random
  }
  const created = { name: pick(ANIMALS), color: pick(COLORS) }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(created))
  } catch {
    // private mode / quota exceeded — non-fatal
  }
  return created
}

let cachedSnapshot: PresenceUser[] = []

function readPresence(): PresenceUser[] {
  const next: PresenceUser[] = []
  awareness.getStates().forEach((state, clientID) => {
    const user = (state as { user?: PresenceUser }).user
    if (user) next.push({ ...user, id: clientID })
  })
  return next
}

function snapshotsEqual(a: PresenceUser[], b: PresenceUser[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    const x = a[i]
    const y = b[i]
    if (x.id !== y.id || x.name !== y.name || x.color !== y.color) return false
  }
  return true
}

function subscribe(onChange: () => void): () => void {
  const handler = () => {
    const next = readPresence()
    if (!snapshotsEqual(next, cachedSnapshot)) {
      cachedSnapshot = next
      onChange()
    }
  }
  awareness.on('change', handler)
  return () => awareness.off('change', handler)
}

function getSnapshot(): PresenceUser[] {
  return cachedSnapshot
}

export function setLocalUser(user?: { name: string; color: string }): void {
  const resolved = user ?? loadOrCreateUser()
  awareness.setLocalStateField('user', {
    id: awareness.clientID,
    name: resolved.name,
    color: resolved.color,
  } satisfies PresenceUser)
  cachedSnapshot = readPresence()
}

export function usePresence(): PresenceUser[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
