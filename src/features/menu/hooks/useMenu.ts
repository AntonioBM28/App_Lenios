import { useState, useEffect, useMemo } from 'react'
import type { Producto, Categoria } from '@/shared/types'
import { menuService } from '../services/menuService'

const TODAS = 'todas'

interface UseMenuReturn {
  /** Todos los productos del catálogo */
  productos: Producto[]
  /** Lista de categorías para los tabs/chips de filtro */
  categorias: Categoria[]
  /** Productos filtrados según la categoría seleccionada */
  productosFiltrados: Producto[]
  /** Productos marcados como destacados (para la sección en Home) */
  productosDestacados: Producto[]
  /** ID de la categoría activa; 'todas' para mostrar todo */
  categoriaActiva: string
  setCategoriaActiva: (id: string) => void
  loading: boolean
  error: string | null
  /** Vuelve a ejecutar el fetch (útil para un botón "Reintentar") */
  retry: () => void
}

/**
 * Hook principal del feature de menú.
 *
 * - Llama a menuService (mock o real, según la factory) para obtener datos.
 * - Expone el filtrado por categoría como estado interno.
 * - Expone productosDestacados para la sección "Sabores Destacados" del Home.
 * - Totalmente independiente de la implementación del servicio.
 */
export function useMenu(): UseMenuReturn {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoriaActiva, setCategoriaActiva] = useState<string>(TODAS)
  const [fetchCount, setFetchCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([menuService.getProductos(), menuService.getCategorias()])
      .then(([prods, cats]) => {
        if (!cancelled) {
          setProductos(prods)
          setCategorias(cats)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar el menú')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [fetchCount])

  /** Filtra por categoría seleccionada — recalcular solo cuando cambia la lista o el filtro */
  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === TODAS) return productos
    return productos.filter((p) => p.categoriaId === categoriaActiva)
  }, [productos, categoriaActiva])

  /** Solo los marcados como destacados, máximo 5 */
  const productosDestacados = useMemo(
    () => productos.filter((p) => p.destacado).slice(0, 5),
    [productos]
  )

  return {
    productos,
    categorias,
    productosFiltrados,
    productosDestacados,
    categoriaActiva,
    setCategoriaActiva,
    loading,
    error,
    retry: () => setFetchCount((n) => n + 1),
  }
}
