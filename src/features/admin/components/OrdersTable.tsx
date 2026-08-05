import { Trash2, Eye } from 'lucide-react'
import type { Pedido, EstadoPedido } from '@/shared/types'
import { formatCurrency } from '@/shared/utils'

interface OrdersTableProps {
  pedidos: Pedido[]
  onStatusChange: (id: string, newStatus: EstadoPedido) => void
  onView: (pedido: Pedido) => void
  onDelete: (pedido: Pedido) => void
}

const getStatusConfig = (estado: EstadoPedido) => {
  switch (estado) {
    case 'recibido':
      return { bg: 'bg-dark-border text-beige', label: 'Recibido' }
    case 'en_preparacion':
      return { bg: 'bg-amber-500/20 text-amber-500 border border-amber-500/30', label: 'En preparación' }
    case 'en_camino':
      return { bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', label: 'En camino' }
    case 'entregado':
      return { bg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', label: 'Entregado' }
    default:
      return { bg: 'bg-dark-border text-white', label: estado }
  }
}

export function OrdersTable({ pedidos, onStatusChange, onView, onDelete }: OrdersTableProps) {
  if (pedidos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-dark-border rounded-card">
        <span className="text-beige/40">No hay pedidos registrados</span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-dark-border text-beige/60 text-sm">
            <th className="py-3 px-4 font-medium whitespace-nowrap">ID / Fecha</th>
            <th className="py-3 px-4 font-medium">Cliente</th>
            <th className="py-3 px-4 font-medium">Resumen</th>
            <th className="py-3 px-4 font-medium text-right">Total</th>
            <th className="py-3 px-4 font-medium text-center">Estado</th>
            <th className="py-3 px-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => {
            const statusConfig = getStatusConfig(p.estado)
            const itemCount = p.items.reduce((acc, item) => acc + item.cantidad, 0)
            const mainItemName = p.items[0]?.nombre || 'Productos'
            
            return (
              <tr key={p.id} className="border-b border-dark-border/50 hover:bg-dark-border/20 transition-colors">
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <p className="font-mono text-white">#{p.id.split('-')[1]}</p>
                    <p className="text-beige/60 text-xs">
                      {new Date(p.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-semibold text-white text-sm whitespace-nowrap">{p.cliente}</p>
                    <p className="text-beige/60 text-xs truncate max-w-[150px]" title={p.direccion}>
                      {p.direccion}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <p className="text-white truncate max-w-[180px]">{mainItemName}</p>
                    {itemCount > 1 && (
                      <p className="text-beige/60 text-xs">y {itemCount - 1} más...</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-sm text-white font-medium whitespace-nowrap">
                  {formatCurrency(p.total)}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="relative inline-block w-40">
                    <select
                      value={p.estado}
                      onChange={(e) => onStatusChange(p.id, e.target.value as EstadoPedido)}
                      className={`w-full appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-primary ${statusConfig.bg}`}
                    >
                      <option value="recibido" className="bg-dark-bg text-white">Recibido</option>
                      <option value="en_preparacion" className="bg-dark-bg text-white">En preparación</option>
                      <option value="en_camino" className="bg-dark-bg text-white">En camino</option>
                      <option value="entregado" className="bg-dark-bg text-white">Entregado</option>
                    </select>
                    {/* Flechita para el select */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onView(p)}
                      className="p-1.5 text-beige/60 hover:text-white rounded hover:bg-dark-border transition-colors"
                      title="Ver detalle"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="p-1.5 text-red-400/60 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                      title="Eliminar pedido"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
