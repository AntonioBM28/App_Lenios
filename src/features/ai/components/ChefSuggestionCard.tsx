import { Link } from 'react-router-dom'
import { ChefHat, ChevronRight } from 'lucide-react'
import type { Producto } from '@/shared/types'
import type { ChefSuggestion } from '../types'

interface ChefSuggestionCardProps {
  suggestion: ChefSuggestion
  /** Catálogo completo ya cargado por useMenu — se cruza por id contra productoIds */
  productos: Producto[]
}

/**
 * Tarjeta destacada del Home con la "Sugerencia del Chef" del día,
 * redactada por IA (Groq) a partir de productos REALES del catálogo.
 * Ver ChefSuggestionUseCase (backend) para el porqué del texto/caché.
 */
export function ChefSuggestionCard({ suggestion, productos }: ChefSuggestionCardProps) {
  const productosReferenciados = suggestion.productoIds
    .map((id) => productos.find((p) => p.id === id))
    .filter((p): p is Producto => !!p)

  return (
    <div className="relative overflow-hidden rounded-card border border-primary/30 bg-gradient-to-br from-primary/20 via-dark-card to-dark-card p-6 sm:p-8">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-3">
            <ChefHat size={14} />
            Sugerencia del Chef · IA
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
            {suggestion.titulo}
          </h3>
          <p className="text-beige/70 text-sm leading-relaxed max-w-lg">
            {suggestion.descripcion}
          </p>
        </div>

        {productosReferenciados.length > 0 && (
          <div className="flex sm:flex-col gap-3 shrink-0 overflow-x-auto sm:overflow-visible">
            {productosReferenciados.slice(0, 3).map((producto) => (
              <Link
                key={producto.id}
                to="/menu"
                className="flex items-center gap-2 bg-dark-bg/60 border border-dark-border rounded-btn px-3 py-2 hover:border-primary/50 transition-colors group shrink-0"
              >
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-9 h-9 rounded-md object-cover shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/60x60/1C110A/F97316?text=%F0%9F%AA%B5'
                  }}
                />
                <span className="text-xs font-medium text-beige/80 group-hover:text-white transition-colors whitespace-nowrap">
                  {producto.nombre}
                </span>
                <ChevronRight
                  size={14}
                  className="text-beige/40 group-hover:text-primary transition-colors shrink-0"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
