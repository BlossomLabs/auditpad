export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface Finding {
  id: string
  title: string
  severity: Severity
  agent: string
  location: string
  corroborations: number
}

export interface PresenceUser {
  id: number
  name: string
  color: string
}
