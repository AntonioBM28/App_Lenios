import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

/**
 * Aviso de Privacidad Simplificado (RF3/RF4).
 * Debe ser visible antes de que el usuario capture datos personales en
 * DeliveryForm — se coloca arriba del primer input del formulario.
 *
 * El link a /privacy abre en pestaña nueva para no perder el carrito ni
 * el progreso del formulario que el usuario ya llenó.
 */
export function PrivacyNoticeSummary() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-btn bg-dark-bg border border-dark-border/80">
      <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
      <p className="text-xs text-beige/70 leading-relaxed">
        Tus datos (nombre, teléfono y dirección) se usan únicamente para procesar y
        entregar tu pedido, y se comparten contigo mismo vía WhatsApp para coordinar la
        entrega. Consulta el{' '}
        <Link
          to="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-secondary underline underline-offset-2 font-medium"
        >
          Aviso de Privacidad Integral
        </Link>{' '}
        para más información.
      </p>
    </div>
  )
}
