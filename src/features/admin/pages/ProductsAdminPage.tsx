import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAdminProductService } from '../services/adminProductService'
import { ProductsTable } from '../components/ProductsTable'
import { ProductFormModal } from '../components/ProductFormModal'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import type { Producto } from '@/shared/types'

export default function ProductsAdminPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  // Estados modales
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Producto | null>(null)
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null)

  const adminService = getAdminProductService()

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAll()
      setProductos(data)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleSaveProduct = async (data: Omit<Producto, 'id'>) => {
    try {
      if (productToEdit) {
        await adminService.update(productToEdit.id, data)
        toast.success('Producto actualizado')
      } else {
        await adminService.create(data)
        toast.success('Producto creado')
      }
      await loadProducts()
    } catch (error) {
      console.error(error)
      toast.error('Ocurrió un error al guardar')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return
    try {
      await adminService.delete(productToDelete.id)
      toast.success('Producto eliminado')
      setIsDeleteOpen(false)
      setProductToDelete(null)
      await loadProducts()
    } catch (error) {
      console.error(error)
      toast.error('No se pudo eliminar el producto')
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await adminService.toggleStatus(id)
      toast.success('Estado actualizado')
      // Refresco optimista
      setProductos(prev => prev.map(p => 
        p.id === id ? { ...p, disponible: !p.disponible } : p
      ))
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar el estado')
    }
  }

  const openNewForm = () => {
    setProductToEdit(null)
    setIsFormOpen(true)
  }

  const openEditForm = (producto: Producto) => {
    setProductToEdit(producto)
    setIsFormOpen(true)
  }

  const openDeleteConfirm = (producto: Producto) => {
    setProductToDelete(producto)
    setIsDeleteOpen(true)
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white mb-1">Productos</h1>
          <p className="text-beige/60 text-sm">Gestiona el catálogo y la disponibilidad</p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary text-white font-semibold rounded-btn transition-colors focus:ring-2 focus:ring-primary"
        >
          <Plus size={18} />
          Agregar Producto
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <ProductsTable 
            productos={productos} 
            onEdit={openEditForm} 
            onDelete={openDeleteConfirm}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  )
}
