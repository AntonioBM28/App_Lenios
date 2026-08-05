import { useState, useEffect, useMemo } from 'react'
import { getAdminProductService } from '../services/adminProductService'
import { StockTable } from '../components/StockTable'
import type { Producto } from '@/shared/types'
import toast from 'react-hot-toast'
import { Filter, ArrowDownUp } from 'lucide-react'

export default function StockAdminPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters and Sorting
  const [showLowStockOnly, setShowLowStockOnly] = useState(false)
  const [sortByStockAsc, setSortByStockAsc] = useState(false)

  const adminService = getAdminProductService()

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAll()
      setProductos(data)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar inventario')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleChangeStock = async (id: string, newStock: number) => {
    try {
      const updatedProduct = await adminService.updateStock(id, newStock)
      
      // Actualización optimista en el cliente para evitar refetch completo
      setProductos(prev => prev.map(p => 
        p.id === id ? updatedProduct : p
      ))
      
      toast.success('Stock guardado')
    } catch (error) {
      console.error(error)
      toast.error('Error al guardar el stock')
      // Refetch completo para sincronizar en caso de error
      loadProducts()
    }
  }

  // Derived state: filtered and sorted products
  const processedProducts = useMemo(() => {
    let result = [...productos]
    
    // Filter
    if (showLowStockOnly) {
      result = result.filter(p => p.stock <= 3 && p.stock > 0)
    }
    
    // Sort
    if (sortByStockAsc) {
      result.sort((a, b) => a.stock - b.stock)
    } else {
      // Default sort (perhaps by name or category, assuming original order for now)
    }

    return result
  }, [productos, showLowStockOnly, sortByStockAsc])

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white mb-1">Control de Stock</h1>
          <p className="text-beige/60 text-sm">Ajuste rápido de cantidades y disponibilidad</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-dark-border rounded-btn cursor-pointer hover:bg-dark-border/50 transition-colors">
            <input 
              type="checkbox" 
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded border-dark-border text-primary focus:ring-primary bg-dark-bg" 
            />
            <Filter size={16} className="text-beige/60" />
            <span className="text-sm text-white font-medium">Solo stock bajo (≤ 3)</span>
          </label>
          
          <button
            onClick={() => setSortByStockAsc(!sortByStockAsc)}
            className={`flex items-center gap-2 px-3 py-2 rounded-btn border transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              sortByStockAsc 
                ? 'bg-primary/10 border-primary/30 text-primary' 
                : 'bg-dark-card border-dark-border text-beige/80 hover:bg-dark-border/50'
            }`}
            title="Ordenar de menor a mayor stock"
          >
            <ArrowDownUp size={16} />
            <span className="text-sm font-medium">Menor stock primero</span>
          </button>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-dark-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <StockTable 
            productos={processedProducts}
            onChangeStock={handleChangeStock}
          />
        )}
      </div>
    </div>
  )
}
