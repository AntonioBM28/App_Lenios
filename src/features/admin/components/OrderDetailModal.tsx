import { Modal } from '@/shared/components/Modal'
import type { Pedido } from '@/shared/types'
import { formatCurrency } from '@/shared/utils'

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  pedido: Pedido | null
}

export function OrderDetailModal({ isOpen, onClose, pedido }: OrderDetailModalProps) {
  if (!pedido) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalle del Pedido ${pedido.id.split('-')[1]}`} maxWidth="max-w-2xl">
      <div className="flex flex-col gap-6">
        
        {/* Info del Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-dark-bg border border-dark-border rounded-lg">
          <div>
            <p className="text-beige/60 text-xs font-medium uppercase tracking-wider mb-1">Cliente</p>
            <p className="text-white font-medium">{pedido.cliente}</p>
          </div>
          <div>
            <p className="text-beige/60 text-xs font-medium uppercase tracking-wider mb-1">Teléfono</p>
            <p className="text-white font-medium">{pedido.telefono}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-beige/60 text-xs font-medium uppercase tracking-wider mb-1">Dirección de Entrega</p>
            <p className="text-white font-medium">{pedido.direccion}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-beige/60 text-xs font-medium uppercase tracking-wider mb-1">Fecha y Hora</p>
            <p className="text-white font-medium">{new Date(pedido.fecha).toLocaleString('es-MX')}</p>
          </div>
        </div>

        {/* Lista de Productos */}
        <div>
          <h3 className="font-heading font-semibold text-white mb-3">Productos</h3>
          <div className="bg-dark-bg border border-dark-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark-border/30 text-beige/60">
                <tr>
                  <th className="py-2 px-4 font-medium">Cant.</th>
                  <th className="py-2 px-4 font-medium">Producto</th>
                  <th className="py-2 px-4 font-medium text-right">P. Unitario</th>
                  <th className="py-2 px-4 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {pedido.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-white font-medium">{item.cantidad}x</td>
                    <td className="py-3 px-4 text-beige/90">{item.nombre}</td>
                    <td className="py-3 px-4 text-right text-beige/60">{formatCurrency(item.precioUnitario)}</td>
                    <td className="py-3 px-4 text-right text-white font-medium">
                      {formatCurrency(item.cantidad * item.precioUnitario)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totales */}
        <div className="flex justify-end pt-4 border-t border-dark-border">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-beige/80 text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(pedido.total)}</span>
            </div>
            <div className="flex justify-between text-beige/80 text-sm">
              <span>Costo de Envío</span>
              <span>Calculado por WhatsApp</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-dark-border/50">
              <span>Total Estimado</span>
              <span className="text-primary">{formatCurrency(pedido.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-dark-bg border border-dark-border hover:bg-dark-border text-white rounded-btn transition-colors font-medium focus:ring-2 focus:ring-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}
