import { Minus, Plus, AlertTriangle } from 'lucide-react'
import type { Producto } from '@/shared/types'
import { useState, useEffect } from 'react'

interface StockTableProps {
  productos: Producto[]
  onChangeStock: (id: string, newStock: number) => void
}

/**
 * Componente interno para manejar el estado local de un input numérico y
 * aplicar debounce antes de disparar el onChange hacia el padre.
 * Esto evita latencia al tipear números largos.
 */
function StockRow({ p, onChangeStock }: { p: Producto, onChangeStock: (id: string, newStock: number) => void }) {
  const [localStock, setLocalStock] = useState(p.stock)
  const [debouncedStock, setDebouncedStock] = useState(p.stock)

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedStock(localStock)
    }, 400)
    return () => clearTimeout(handler)
  }, [localStock])

  // Sincronizar si prop cambia desde afuera (ej. guardado del server o refresco general)
  useEffect(() => {
    setLocalStock(p.stock)
  }, [p.stock])

  // Disparar update cuando el debounce resuelve (solo si cambió respecto al prop real)
  useEffect(() => {
    if (debouncedStock !== p.stock && debouncedStock >= 0) {
      onChangeStock(p.id, debouncedStock)
    }
  }, [debouncedStock, p.id, p.stock, onChangeStock])

  const handleDecrement = () => {
    if (localStock > 0) {
      const newVal = localStock - 1
      setLocalStock(newVal)
      // Disparar inmediatamente en clicks de botón (saltarse el debounce)
      onChangeStock(p.id, newVal)
    }
  }

  const handleIncrement = () => {
    const newVal = localStock + 1
    setLocalStock(newVal)
    // Disparar inmediatamente
    onChangeStock(p.id, newVal)
  }

  const isLowStock = localStock > 0 && localStock <= 3
  const isOutOfStock = localStock === 0

  return (
    <tr className={`border-b border-dark-border/50 transition-colors ${isOutOfStock ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-dark-border/20'}`}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-dark-bg border border-dark-border opacity-90">
            <img src={p.imagenUrl} alt={p.nombre} className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`} loading="lazy" />
          </div>
          <div>
            <p className={`font-semibold text-sm ${isOutOfStock ? 'text-beige/60 line-through' : 'text-white'}`}>
              {p.nombre}
            </p>
            {isLowStock && (
              <p className="text-amber-500 flex items-center gap-1 text-[11px] font-medium mt-0.5">
                <AlertTriangle size={12} /> Stock Bajo
              </p>
            )}
          </div>
        </div>
      </td>
      
      <td className="py-3 px-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          isOutOfStock
            ? 'bg-red-500/10 text-red-400 border-red-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {isOutOfStock ? 'Agotado' : 'Disponible'}
        </span>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleDecrement}
            disabled={localStock === 0}
            className="w-8 h-8 flex items-center justify-center rounded bg-dark-bg border border-dark-border text-white hover:border-primary disabled:opacity-50 disabled:hover:border-dark-border transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Disminuir stock"
          >
            <Minus size={16} />
          </button>
          
          <input
            type="number"
            value={localStock === 0 ? '' : localStock} // Mostrar input vacío si es 0 y está editando (mejor UX), o 0 si no
            placeholder="0"
            min="0"
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              setLocalStock(isNaN(val) ? 0 : val)
            }}
            className="w-14 h-8 text-center bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary focus:bg-dark-bg rounded text-white font-mono text-sm appearance-none"
            aria-label="Stock actual"
          />

          <button
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center rounded bg-dark-bg border border-dark-border text-white hover:border-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Aumentar stock"
          >
            <Plus size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export function StockTable({ productos, onChangeStock }: StockTableProps) {
  if (productos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-dark-border rounded-card">
        <span className="text-beige/40">No se encontraron productos</span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-border text-beige/60 text-sm">
            <th className="py-3 px-4 font-medium">Producto</th>
            <th className="py-3 px-4 font-medium text-center">Estado (Auto)</th>
            <th className="py-3 px-4 font-medium text-right pr-6">Cantidad Actual</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <StockRow key={p.id} p={p} onChangeStock={onChangeStock} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
