import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/Button'
import { ChevronRight, Star } from 'lucide-react'
import { useMenu } from '@/features/menu/hooks/useMenu'
import { ProductCard } from '@/features/menu/components/ProductCard'
import { ClosedBanner } from '@/features/business-hours/components/ClosedBanner'

/** Skeleton de una tarjeta destacada para el estado de carga en Home */
function FeaturedSkeleton() {
  return (
    <div className="flex flex-col bg-dark-card border border-dark-border rounded-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-dark-border" />
      <div className="flex flex-col p-4 gap-3">
        <div className="h-4 rounded bg-dark-border w-3/4" />
        <div className="h-3 rounded bg-dark-border w-full" />
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-dark-border">
          <div className="h-5 rounded bg-dark-border w-16" />
          <div className="h-8 rounded-btn bg-dark-border w-24" />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { productosDestacados, loading } = useMenu()

  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[82vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Glow radial */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[700px] h-[700px] rounded-full bg-primary/8 blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium mb-6">
            <Star size={14} fill="currentColor" />
            Artesanal · Fresco · Delicioso
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Los mejores{' '}
            <span className="text-primary">Leños Rellenos</span>{' '}
            de la ciudad
          </h1>

          <p className="text-beige text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto">
            Sabores auténticos, ingredientes frescos y la calidez artesanal que hace especial cada bocado.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/menu">
              <Button size="lg" variant="primary">
                Ver Menú completo
                <ChevronRight size={18} />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="ghost">
                Nuestra Historia
              </Button>
            </Link>
          </div>
        </div>

        {/* Separador ondulado */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-bg to-transparent" />
      </section>

      {/* ── Sabores Destacados ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <ClosedBanner />
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">
              Sabores <span className="text-primary">Destacados</span>
            </h2>
            <p className="text-beige/60 text-sm">
              Los leños que más enamoran a nuestros clientes
            </p>
          </div>
          <Link
            to="/menu"
            className="hidden sm:flex items-center gap-1.5 text-sm text-primary hover:text-secondary transition-colors font-medium whitespace-nowrap"
          >
            Ver todos
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Grid de destacados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <FeaturedSkeleton key={i} />)
            : productosDestacados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                />
              ))}
        </div>

        {/* Link mobile */}
        <div className="sm:hidden mt-8 text-center">
          <Link to="/menu">
            <Button variant="outline" size="md">
              Ver menú completo
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Por qué elegirnos ──────────────────────────────────────── */}
      <section className="border-t border-dark-border bg-dark-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { emoji: '🌿', titulo: 'Ingredientes frescos', desc: 'Seleccionados cada mañana del mercado local' },
              { emoji: '🔥', titulo: 'Hechos al momento', desc: 'Preparación artesanal en menos de 15 minutos' },
              { emoji: '❤️', titulo: 'Con amor', desc: 'Recetas familiares con más de 10 años de tradición' },
            ].map(({ emoji, titulo, desc }) => (
              <div key={titulo} className="flex flex-col items-center gap-3">
                <span className="text-4xl">{emoji}</span>
                <h3 className="font-heading font-semibold text-white">{titulo}</h3>
                <p className="text-beige/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
