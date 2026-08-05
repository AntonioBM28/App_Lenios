import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react'
import { BusinessStatusBadge } from '@/features/business-hours/components/BusinessStatusBadge'
import { env } from '@/core/config/env'

export default function ContactPage() {
  const number = env.whatsappNumber

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
            <span className="text-primary">Contáctanos</span>
          </h1>
          <p className="text-beige/70 text-lg">
            Estamos listos para atenderte y preparar los mejores leños.
          </p>
        </div>
        <BusinessStatusBadge />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Info general */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 p-6 rounded-card bg-dark-card border border-dark-border hover:border-primary/30 transition-colors">
            <MapPin size={24} className="text-primary shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-white text-sm">Ubicación</p>
              <p className="text-beige/60 text-sm mt-0.5">Av. Leños 123, Colonia Centro. C.P. 12345</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 rounded-card bg-dark-card border border-dark-border hover:border-emerald-500/30 transition-colors">
            <MessageCircle size={24} className="text-emerald-400 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-white text-sm">WhatsApp (Pedidos)</p>
              <p className="text-beige/60 text-sm mt-0.5">+{number}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-card bg-dark-card border border-dark-border">
            <Phone size={24} className="text-blue-400 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-white text-sm">Teléfono Fijo</p>
              <p className="text-beige/60 text-sm mt-0.5">Próximamente</p>
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="p-6 rounded-card bg-dark-card border border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={24} className="text-amber-400" strokeWidth={1.5} />
            <h2 className="font-heading font-semibold text-white text-lg">
              Horario de Atención
            </h2>
          </div>
          
          <ul className="flex flex-col gap-3">
            {[
              { dia: 'Lunes', horas: 'Cerrado' },
              { dia: 'Martes', horas: '13:00 - 21:00' },
              { dia: 'Miércoles', horas: '13:00 - 21:00' },
              { dia: 'Jueves', horas: '13:00 - 21:00' },
              { dia: 'Viernes', horas: '13:00 - 22:00' },
              { dia: 'Sábado', horas: '13:00 - 22:00' },
              { dia: 'Domingo', horas: '13:00 - 21:00' },
            ].map(({ dia, horas }) => (
              <li key={dia} className="flex justify-between items-center text-sm border-b border-dark-border/50 pb-2 last:border-0 last:pb-0">
                <span className="text-white font-medium">{dia}</span>
                <span className={horas === 'Cerrado' ? 'text-red-400/80 italic' : 'text-beige/70'}>
                  {horas}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
