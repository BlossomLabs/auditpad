import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

let configured = false

/**
 * Force `@monaco-editor/react` to use the locally-bundled `monaco-editor`
 * package instead of lazy-loading a second copy from a CDN.
 *
 * `y-monaco` imports `monaco-editor` directly. If the editor on the page is
 * a different copy of Monaco than the one `MonacoBinding` was constructed
 * against, the binding silently does nothing — the constructor's instanceof
 * checks fail and updates never propagate. Calling this once at startup
 * guarantees both sides see the same Monaco.
 */
export function configureMonacoLoader(): void {
  if (configured) return
  configured = true
  loader.config({ monaco })
}
