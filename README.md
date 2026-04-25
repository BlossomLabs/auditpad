# auditpad

Frontend for the **Collaborative Smart Contract Audit Swarm** — three specialist
auditor agents running on separate AXL nodes, collaborating over an encrypted P2P
mesh and merging findings into a shared CRDT knowledge graph.

This repo currently contains the operator-facing console: a swarm dashboard, an
audit workspace with a Monaco-based Solidity editor, and a merged findings view.
Wire-up to AXL / CRDT replicas comes next.

## Stack

- [Vite 8](https://vite.dev/) + React 19 + TypeScript
- [React Router v7](https://reactrouter.com/) (data router, library mode)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) via `@monaco-editor/react`
  (custom Solidity tokenizer registered in `src/lib/monacoSolidity.ts`)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`

## Routes

| Path        | Purpose                                                            |
| ----------- | ------------------------------------------------------------------ |
| `/`         | Swarm dashboard — agent roster, mesh stats, CRDT counters          |
| `/audit`    | Audit workspace — Monaco editor + live findings sidebar            |
| `/findings` | Merged findings view across all agents                             |

## Project layout

```
src/
  main.tsx              # router + entrypoint
  index.css             # tailwind v4 + theme tokens
  app/
    AppLayout.tsx       # sidebar + outlet
    PageHeader.tsx      # shared page header
    routes/
      DashboardPage.tsx
      AuditPage.tsx     # Monaco editor lives here
      FindingsPage.tsx
      NotFoundPage.tsx
  lib/
    sampleContract.ts   # Vault.sol — deliberately flawed demo target
    monacoSolidity.ts   # minimal Solidity tokenizer for Monaco
```

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```
