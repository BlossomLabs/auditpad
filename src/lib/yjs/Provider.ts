import * as Y from 'yjs'
import {
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
  type Awareness,
} from 'y-protocols/awareness'

import { awareness, ydoc } from './doc'

export interface YProvider {
  connect(): void
  disconnect(): void
}

type Message =
  | { type: 'doc-update'; payload: number[] }
  | { type: 'awareness-update'; payload: number[] }
  | { type: 'sync-request'; stateVector: number[] }
  | { type: 'awareness-query' }

/**
 * Cross-tab Yjs provider backed by the browser's BroadcastChannel.
 *
 * Acts as a local stand-in for a real network provider (y-websocket or the
 * future AXL/GossipSub provider). Two tabs of auditpad on the same machine
 * will see each other's edits + cursors live, which is enough to demo the
 * collaborative editor without a server.
 *
 * Swap for a network-backed provider by implementing the same {@link YProvider}
 * interface and registering it from `main.tsx`.
 */
export class LocalProvider implements YProvider {
  private channel: BroadcastChannel | null = null
  private readonly doc: Y.Doc
  private readonly awareness: Awareness
  private readonly channelName: string

  constructor(opts: { channelName?: string } = {}) {
    this.doc = ydoc
    this.awareness = awareness
    this.channelName = opts.channelName ?? 'auditpad-yjs'
  }

  connect(): void {
    if (this.channel) return

    const channel = new BroadcastChannel(this.channelName)
    this.channel = channel

    this.doc.on('update', this.handleDocUpdate)
    this.awareness.on('update', this.handleAwarenessUpdate)
    channel.addEventListener('message', this.handleMessage)
    window.addEventListener('beforeunload', this.handleUnload)

    this.send({
      type: 'sync-request',
      stateVector: Array.from(Y.encodeStateVector(this.doc)),
    })
    this.send({ type: 'awareness-query' })
    this.broadcastLocalAwareness()
  }

  disconnect(): void {
    if (!this.channel) return

    removeAwarenessStates(this.awareness, [this.doc.clientID], this)
    this.doc.off('update', this.handleDocUpdate)
    this.awareness.off('update', this.handleAwarenessUpdate)
    this.channel.removeEventListener('message', this.handleMessage)
    window.removeEventListener('beforeunload', this.handleUnload)
    this.channel.close()
    this.channel = null
  }

  private send(message: Message): void {
    this.channel?.postMessage(message)
  }

  private broadcastLocalAwareness(): void {
    const update = encodeAwarenessUpdate(this.awareness, [this.doc.clientID])
    this.send({ type: 'awareness-update', payload: Array.from(update) })
  }

  private handleDocUpdate = (update: Uint8Array, origin: unknown): void => {
    if (origin === this) return
    this.send({ type: 'doc-update', payload: Array.from(update) })
  }

  private handleAwarenessUpdate = (
    _changes: { added: number[]; updated: number[]; removed: number[] },
    origin: unknown,
  ): void => {
    if (origin === this) return
    this.broadcastLocalAwareness()
  }

  private handleMessage = (event: MessageEvent<Message>): void => {
    const message = event.data
    switch (message.type) {
      case 'doc-update':
        Y.applyUpdate(this.doc, new Uint8Array(message.payload), this)
        break
      case 'awareness-update':
        applyAwarenessUpdate(
          this.awareness,
          new Uint8Array(message.payload),
          this,
        )
        break
      case 'sync-request': {
        const diff = Y.encodeStateAsUpdate(
          this.doc,
          new Uint8Array(message.stateVector),
        )
        this.send({ type: 'doc-update', payload: Array.from(diff) })
        break
      }
      case 'awareness-query':
        this.broadcastLocalAwareness()
        break
    }
  }

  private handleUnload = (): void => {
    this.disconnect()
  }
}
