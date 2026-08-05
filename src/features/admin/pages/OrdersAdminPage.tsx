import { useState, useEffect } from 'react'
import { getAdminOrdersService } from '../services/adminOrdersService'
import { OrdersTable } from '../components/OrdersTable'
import { OrderDetailModal } from '../components/OrderDetailModal'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import type { Pedido, EstadoPedido } from '@/shared/types'
import toast from 'react-hot-toast'

export default function OrdersAdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal de Detalle
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  // Modal de Eliminación
  const [orderToDelete, setOrderToDelete] = useState<Pedido | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const ordersService = getAdminOrdersService()

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await ordersService.listOrders()
      setPedidos(data)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (id: string, newStatus: EstadoPedido) => {
    try {
      const updatedOrder = await ordersService.updateOrderStatus(id, newStatus)
      // Optimistic update
      setPedidos(prev => prev.map(p => p.id === id ? updatedOrder : p))
      toast.success('Estado actualizado')
    } catch (error) {
      console.error(error)
      toast.error('Error al actualizar el estado')
      loadOrders() // Revertir en caso de error
    }
  }

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return
    try {
      await ordersService.deleteOrder(orderToDelete.id)
      toast.success('Pedido eliminado')
      setIsDeleteOpen(false)
      setOrderToDelete(null)
      loadOrders()
    } catch (error) {
      console.error(error)
      toast.error('Error al eliminar el pedido')
    }
  }

  const handleView = (pedido: Pedido) => {
    setSelectedOrder(pedido)
    setIsDetailOpen(true)
  }

  const handleDeleteClick = (pedido: Pedido) => {
    setOrderToDelete(pedido)
    setIsDeleteOpen(true)
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white mb-1">Pedidos</h1>
          <p className="text-beige/60 text-sm">Historial y gestión de pedidos recibidos</p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <OrdersTable 
            pedidos={pedidos}
            onStatusChange={handleStatusChange}
            onView={handleView}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      <OrderDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        pedido={selectedOrder}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Pedido"
        message={`¿Estás seguro de que deseas eliminar el pedido #${orderToDelete?.id.split('-')[1]} de ${orderToDelete?.cliente}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  )
}
