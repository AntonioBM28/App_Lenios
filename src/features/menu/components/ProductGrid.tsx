/** Skeleton de una sola tarjeta mientras carga */
function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-dark-card border border-dark-border rounded-card overflow-hidden animate-pulse">
      {/* Imagen placeholder */}
      <div className="aspect-[4/3] bg-dark-border" />
      {/* Contenido placeholder */}
      <div className="flex flex-col p-4 gap-3">
        <div className="h-4 rounded bg-dark-border w-3/4" />
        <div className="h-3 rounded bg-dark-border w-full" />
        <div className="h-3 rounded bg-dark-border w-5/6" />
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-dark-border">
          <div className="h-5 rounded bg-dark-border w-16" />
          <div className="h-8 rounded-btn bg-dark-border w-24" />
        </div>
      </div>
    </div>
  )
}

interface ProductGridProps {
  children: React.ReactNode
  loading?: boolean
  /** Número de skeletons a mostrar durante la carga */
  skeletonCount?: number
}

/**
 * Grid responsivo para ProductCard.
 * - 1 col en mobile
 * - 2 col en sm (tablet)
 * - 3 col en md
 * - 4 col en xl (desktop amplio)
 *
 * Mientras loading=true muestra skeletons animados.
 */
export function ProductGrid({ children, loading = false, skeletonCount = 8 }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        : children}
    </div>
  )
}
