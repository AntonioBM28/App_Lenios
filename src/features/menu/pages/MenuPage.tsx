import { useState } from 'react'
import { useMenu } from '../hooks/useMenu'
import { ProductCard } from '../components/ProductCard'
import { ProductGrid } from '../components/ProductGrid'
import { CategoryTabs } from '../components/CategoryTabs'
import { EmptyState, ErrorState } from '../components/FeedbackStates'
import { ClosedBanner } from '@/features/business-hours/components/ClosedBanner'

/**
 * Página /menu — catálogo completo con filtrado por categoría.
 *
 * RF1: visualización completa del menú + filtros.
 * RF2 (próximo): onAgregar conectará el cart store de Zustand.
 */
export default function MenuPage() {
  const {
    categorias,
    productosFiltrados,
    categoriaActiva,
    setCategoriaActiva,
    loading,
    error,
    retry,
  } = useMenu()

  const [soloDisponibles, setSoloDisponibles] = useState(false)

  const productosVisibles = soloDisponibles
    ? productosFiltrados.filter((p) => p.disponible)
    : productosFiltrados

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <ClosedBanner />
      
      {/* Encabezado */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
            Nuestro <span className="text-primary">Menú</span>
          </h1>
          <p className="text-beige/60 text-base">
            Leños rellenos artesanales hechos al momento con los mejores ingredientes.
          </p>
        </div>
        
        {/* Toggle Disponibilidad */}
        {!error && !loading && (
          <label className="flex items-center gap-2 cursor-pointer group bg-dark-card border border-dark-border px-3 py-2 rounded-btn transition-colors hover:border-primary/50">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={soloDisponibles}
                onChange={(e) => setSoloDisponibles(e.target.checked)}
              />
              <div className={['block w-10 h-6 rounded-full transition-colors', soloDisponibles ? 'bg-primary' : 'bg-dark-bg'].join(' ')}></div>
              <div className={['absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform', soloDisponibles ? 'translate-x-4' : ''].join(' ')}></div>
            </div>
            <span className="text-sm font-medium text-beige/80 group-hover:text-white transition-colors">
              Ocultar agotados
            </span>
          </label>
        )}
      </div>

      {/* Filtros de categoría */}
      {!error && (
        <div className="mb-8">
          <CategoryTabs
            categorias={loading ? [] : categorias}
            activa={categoriaActiva}
            onChange={setCategoriaActiva}
          />
        </div>
      )}

      {/* Contenido principal */}
      {error ? (
        <ErrorState mensaje={error} onRetry={retry} />
      ) : (
        <>
          <ProductGrid loading={loading} skeletonCount={8}>
            {productosVisibles.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  mensaje="Sin productos"
                  submensaje="No hay productos en esta categoría por ahora. ¡Prueba otra!"
                />
              </div>
            ) : (
              productosVisibles.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                />
              ))
            )}
          </ProductGrid>

          {/* Contador de resultados */}
          {!loading && productosVisibles.length > 0 && (
            <p className="mt-8 text-center text-beige/40 text-sm">
              {productosVisibles.length}{' '}
              {productosVisibles.length === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </>
      )}
    </div>
  )
}
