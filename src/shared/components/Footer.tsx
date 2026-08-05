import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark-card border-t border-dark-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="flex items-center gap-2 font-heading font-bold text-white text-lg mb-2">
              <span>🪵</span> LEÑOS <span className="text-primary">RELLENOS</span>
            </p>
            <p className="text-sm text-beige/60 leading-relaxed">
              Comida artesanal hecha con amor,<br /> tradición y los mejores ingredientes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-heading font-semibold text-white mb-3 uppercase tracking-wider">
              Navegación
            </h3>
            <ul className="space-y-2 text-sm text-beige/70">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/menu', label: 'Menú' },
                { to: '/about', label: 'Nosotros' },
                { to: '/contact', label: 'Contacto' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-heading font-semibold text-white mb-3 uppercase tracking-wider">
              Contáctanos
            </h3>
            <ul className="space-y-2 text-sm text-beige/70">
              <li>📍 Tu ciudad, País</li>
              <li>🕐 Lun–Dom: 10am – 9pm</li>
              <li>📱 WhatsApp: próximamente</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-xs text-beige/40">
          <span>© {year} Leños Rellenos. Todos los derechos reservados.</span>
          <span className="hidden sm:inline">·</span>
          <Link to="/privacy" className="hover:text-primary transition-colors underline underline-offset-2">
            Aviso de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
