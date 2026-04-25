import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import { AppLayout } from './app/AppLayout'
import { DashboardPage } from './app/routes/DashboardPage'
import { AuditPage } from './app/routes/AuditPage'
import { FindingsPage } from './app/routes/FindingsPage'
import { NotFoundPage } from './app/routes/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'audit', Component: AuditPage },
      { path: 'findings', Component: FindingsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
