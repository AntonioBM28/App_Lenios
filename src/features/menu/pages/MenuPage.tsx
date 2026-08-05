import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import type { Producto } from '@/shared/types'
import { useMenu } from '../hooks/useMenu'
import { ProductCard } from '../components/ProductCard'
import { ProductGrid } from '../components/ProductGrid'
import { CategoryTabs } from '../components/CategoryTabs'
import { EmptyState, ErrorState } from '../components/FeedbackStates'
import { ClosedBanner } from '@/features/business-hours/components/ClosedBanner'
import { SmartSearchBar } from '@/features/ai/components/SmartSearchBar'
import { useSmartSearch } from '@/features/ai/hooks/useSmartSearch'

/**
 * Página /menu — catálogo completo con filtrado por categoría.
 *
 * RF1: visualización completa del menú + filtros.
 * RF2 (próximo): onAgregar conectará el cart store de Zustand.
 * IA: buscador inteligente (useSmartSearch) reemplaza temporalmente el
 * catálogo filtrado por categoría cuando hay una búsqueda activa.
 */
export default function MenuPage() {
  const {
    productos,
    categorias,
    productosFiltrados,
    categoriaActiva,
    setCategoriaActiva,
    loading,
    error,
    retry,
  } = useMenu()

  const [soloDisponibles, setSoloDisponibles] = useState(false)

  const {
    matches,
    status: searchStatus,
    error: searchError,
    search,
    clear: clearSearch,
  } = useSmartSearch()
  const searchActive = matches !== null

  useEffect(() => {
    if (searchStatus === 'error' && searchError) {
      toast.error(searchError, { duration: 6000 })
    }
  }, [searchStatus, searchError])

  /**
   * Lista unificada a renderizar: cada item trae opcionalmente `razon`
   * (solo cuando viene de una búsqueda IA activa) para el badge de
   * ProductCard. Fuera de una búsqueda, es el catálogo normal filtrado
   * por categoría/disponibilidad, sin razón.
   */
  const productosVisibles: Array<{ producto: Producto; razon?: string }> = searchActive
    ? matches
        .map((m) => {
          const producto = productos.find((p) => p.id === m.productoId)
          return producto ? { producto, razon: m.razon } : null
        })
        .filter((item): item is { producto: Producto; razon: string } => item !== null)
    : (soloDisponibles ? productosFiltrados.filter((p) => p.disponible) : productosFiltrados).map(
        (producto) => ({ producto }),
      )

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
        {!error && !loading && !searchActive && (
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

      {/* Buscador inteligente (IA) */}
      {!error && !loading && (
        <div className="mb-6 max-w-2xl">
          <SmartSearchBar
            onSearch={search}
            onClear={clearSearch}
            loading={searchStatus === 'loading'}
            active={searchActive}
          />
        </div>
      )}

      {/* Filtros de categoría (ocultos durante una búsqueda IA activa) */}
      {!error && !searchActive && (
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
          <ProductGrid loading={loading || searchStatus === 'loading'} skeletonCount={8}>
            {productosVisibles.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  mensaje={searchActive ? 'Sin coincidencias' : 'Sin productos'}
                  submensaje={
                    searchActive
                      ? 'No encontramos nada que coincida con tu búsqueda. Prueba describiéndolo distinto.'
                      : 'No hay productos en esta categoría por ahora. ¡Prueba otra!'
                  }
                />
              </div>
            ) : (
              productosVisibles.map(({ producto, razon }) => (
                <ProductCard key={producto.id} producto={producto} aiReason={razon} />
              ))
            )}
          </ProductGrid>

          {/* Contador de resultados */}
          {!loading && searchStatus !== 'loading' && productosVisibles.length > 0 && (
            <p className="mt-8 text-center text-beige/40 text-sm">
              {searchActive && <span className="text-primary">✨ Resultados de tu búsqueda — </span>}
              {productosVisibles.length}{' '}
              {productosVisibles.length === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </>
      )}
    </div>
  )
}
