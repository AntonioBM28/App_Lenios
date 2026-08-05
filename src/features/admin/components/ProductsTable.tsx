import { Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import type { Producto } from '@/shared/types'
import { formatCurrency } from '@/shared/utils'

interface ProductsTableProps {
  productos: Producto[]
  onEdit: (producto: Producto) => void
  onDelete: (producto: Producto) => void
  onToggleStatus: (id: string) => void
}

export function ProductsTable({ productos, onEdit, onDelete, onToggleStatus }: ProductsTableProps) {
  if (productos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-dark-border rounded-card">
        <span className="text-beige/40">No hay productos registrados</span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-border text-beige/60 text-sm">
            <th className="py-3 px-4 font-medium">Producto</th>
            <th className="py-3 px-4 font-medium">Precio</th>
            <th className="py-3 px-4 font-medium">Stock</th>
            <th className="py-3 px-4 font-medium text-center">Estado</th>
            <th className="py-3 px-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id} className="border-b border-dark-border/50 hover:bg-dark-border/20 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-dark-bg border border-dark-border">
                    <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{p.nombre}</p>
                    <p className="text-beige/60 text-xs">{p.categoriaId}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-white font-medium">
                {formatCurrency(p.precio)}
              </td>
              <td className="py-3 px-4">
                <span className={`text-sm font-medium ${p.stock <= 5 ? 'text-amber-500' : 'text-white'}`}>
                  {p.stock}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onToggleStatus(p.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                    p.disponible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-dark-border text-beige/60 border-dark-border hover:bg-dark-border/80'
                  }`}
                  aria-label={p.disponible ? 'Desactivar producto' : 'Activar producto'}
                >
                  {p.disponible ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {p.disponible ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="p-1.5 text-beige/60 hover:text-white rounded hover:bg-dark-border transition-colors"
                    aria-label={`Editar ${p.nombre}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="p-1.5 text-red-400/60 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                    aria-label={`Eliminar ${p.nombre}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
