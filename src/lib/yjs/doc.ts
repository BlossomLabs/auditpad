import * as Y from 'yjs'
import { Awareness } from 'y-protocols/awareness'

import type { Finding } from './types'

export const ydoc = new Y.Doc()

export const yContract = ydoc.getText('contract')

export const yFindings = ydoc.getArray<Finding>('findings')

export const awareness = new Awareness(ydoc)
