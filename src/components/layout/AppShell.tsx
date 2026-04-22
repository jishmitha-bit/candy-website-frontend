import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) navigate('/auth', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen relative z-[1]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-8 pb-16 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
