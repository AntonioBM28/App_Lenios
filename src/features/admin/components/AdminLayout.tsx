import type { ReactNode } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  ClipboardList, 
  Clock, 
  LogOut,
  Menu,
  X,
  Flame
} from 'lucide-react'
import { useState } from 'react'
import { clearAdminToken } from '@/core/auth/adminSession'

interface AdminLayoutProps {
  children: ReactNode
}

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/orders', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/products', label: 'Productos', icon: Package },
  { to: '/admin/stock', label: 'Stock', icon: Boxes },
  { to: '/admin/hours', label: 'Horarios', icon: Clock },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAdminToken()
    navigate('/')
    // Pequeño hack para forzar limpieza de estado en AdminAccessGate
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#0F0A06] flex flex-col md:flex-row">
      {/* ── Sidebar Desktop ── */}
      <aside className="hidden md:flex w-64 bg-dark-card border-r border-dark-border flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="text-white" size={18} />
          </div>
          <span className="font-heading font-bold text-lg text-white">Panel Admin</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {adminLinks.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-beige/60 hover:text-beige hover:bg-dark-border',
                ].join(' ')
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Header Mobile ── */}
      <header className="md:hidden sticky top-0 z-40 bg-dark-card border-b border-dark-border flex items-center justify-between px-4 h-16">
        <Link to="/admin" className="flex items-center gap-2">
          <Flame className="text-primary" size={20} />
          <span className="font-heading font-bold text-white text-lg">Admin</span>
        </Link>
        <button
          className="p-2 text-beige hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ── Menú Mobile ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-card border-b border-dark-border px-2 py-4 space-y-1">
          {adminLinks.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-beige/60 hover:text-beige hover:bg-dark-border',
                ].join(' ')
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-base font-medium text-red-400/70 hover:text-red-400"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
