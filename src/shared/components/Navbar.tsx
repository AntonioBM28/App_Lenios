import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, LayoutDashboard, Menu, X, Flame } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/features/cart/store/cartStore'
import { BusinessStatusBadge } from '@/features/business-hours/components/BusinessStatusBadge'

const navLinks = [
  { to: '/menu', label: 'Menú' },
  { to: '/about', label: 'Nosotros' },
  { to: '/contact', label: 'Contacto' },
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { getItemCount } = useCartStore()
  const totalItems = getItemCount()

  return (
    <header className="sticky top-0 z-50 bg-dark-card/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Badge */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform transition-transform group-hover:rotate-12">
                <Flame className="text-white" size={20} />
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-wide">
                Leños <span className="text-primary">Rellenos</span>
              </span>
            </Link>
            <div className="hidden sm:block">
              <BusinessStatusBadge />
            </div>
          </div>

          {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-beige hover:text-white hover:bg-dark-border',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            id="navbar-cart-btn"
            className="relative p-2 rounded-lg text-beige hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Ver carrito"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          <Link
            to="/admin"
            id="navbar-admin-btn"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-border text-beige/60 hover:text-beige hover:border-wood text-xs transition-colors"
            aria-label="Panel de administrador"
          >
            <LayoutDashboard size={14} />
            <span>Admin</span>
          </Link>

          <button
            className="md:hidden p-2 rounded-lg text-beige hover:bg-dark-border transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </div>

      {menuOpen && (
        <div className="md:hidden bg-dark-card border-t border-dark-border px-4 py-3 flex flex-col gap-1">
          <div className="mb-2">
            <BusinessStatusBadge />
          </div>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                [
                  'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-beige hover:text-white hover:bg-dark-border',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-beige/60 hover:text-beige flex items-center gap-2"
          >
            <LayoutDashboard size={14} />
            Panel Admin
          </Link>
        </div>
      )}
    </header>
  )
}
