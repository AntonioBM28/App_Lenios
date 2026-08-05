import { useEffect, useState } from 'react'
import { Package, Archive, ClipboardList, Users, TrendingUp } from 'lucide-react'
import { getAdminService } from '../services/adminService'
import type { DashboardStats } from '../types'
import { BusinessStatusBadge } from '@/features/business-hours/components/BusinessStatusBadge'
import { formatCurrency } from '@/shared/utils'
import { getBusinessHoursService } from '@/features/business-hours/services/businessHoursService'
import type { ConfiguracionHorario } from '@/features/business-hours/types'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [config, setConfig] = useState<ConfiguracionHorario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminService = getAdminService()
        const hoursService = getBusinessHoursService()
        
        const [data, hoursConfig] = await Promise.all([
          adminService.getDashboardStats(),
          hoursService.getConfiguracion()
        ])
        
        setStats(data)
        setConfig(hoursConfig)
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()

    const handleStorage = () => {
      getBusinessHoursService().getConfiguracion().then(setConfig).catch(console.error)
    }

    window.addEventListener('business-hours-changed', handleStorage)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('business-hours-changed', handleStorage)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const handleToggleCierreManual = async () => {
    if (!config) return
    try {
      const newConfig = { ...config, cierreManual: !config.cierreManual }
      setConfig(newConfig) // Optimistic update
      await getBusinessHoursService().updateConfiguracion(newConfig)
      toast.success(newConfig.cierreManual ? 'Negocio CERRADO manualmente' : 'Negocio ABIERTO')
    } catch (error) {
      console.error(error)
      toast.error('Error al cambiar estado')
    }
  }

  if (loading || !stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-6 bg-dark-border rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-dark-border rounded-xl"></div>)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white mb-1">
            Dashboard
          </h1>
          <p className="text-beige/60 text-sm">Resumen general de operaciones</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 bg-dark-card border border-dark-border rounded-xl p-3">
          <BusinessStatusBadge />
          
          <div className="hidden sm:block w-px h-8 bg-dark-border"></div>

          {config && (
            <label className="flex items-center gap-3 cursor-pointer group">
              <span className={`text-xs font-semibold uppercase tracking-wide transition-colors ${config.cierreManual ? 'text-red-400' : 'text-beige/60 group-hover:text-beige'}`}>
                {config.cierreManual ? 'Cerrado Manual' : 'Apagar Negocio'}
              </span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="toggle" 
                  className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-dark-card appearance-none cursor-pointer transition-transform duration-300 ease-in-out checked:translate-x-5 z-10"
                  checked={config.cierreManual}
                  onChange={handleToggleCierreManual}
                />
                <label 
                  htmlFor="toggle" 
                  className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${config.cierreManual ? 'bg-red-500' : 'bg-dark-border'}`}
                ></label>
              </div>
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Productos Activos */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-500">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-beige/60 mb-1">Productos Activos</p>
            <p className="text-2xl font-bold text-white">{stats.productosActivos}</p>
          </div>
        </div>

        {/* Productos Inactivos */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-400">
            <Archive size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-beige/60 mb-1">Inactivos / Agotados</p>
            <p className="text-2xl font-bold text-white">{stats.productosInactivos}</p>
          </div>
        </div>

        {/* Pedidos Pendientes */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-500">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-beige/60 mb-1">Pedidos Pendientes</p>
            <p className="text-2xl font-bold text-white">{stats.pedidosPendientes}</p>
          </div>
        </div>

        {/* Clientes Frecuentes */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-beige/60 mb-1">Clientes Frecuentes</p>
            <p className="text-2xl font-bold text-white">{stats.clientesFrecuentes}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas del Día */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-primary" size={24} />
            <h2 className="font-heading font-semibold text-lg text-white">
              Ventas del Día
            </h2>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              {formatCurrency(stats.ventasDelDia)}
            </span>
            <span className="text-beige/60 text-sm">MXN</span>
          </div>
          <p className="text-emerald-400 text-sm mt-3 font-medium">
            +15% respecto a ayer
          </p>
        </div>

        {/* Actividad Reciente Placeholder */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="font-heading font-semibold text-lg text-white mb-4">
            Actividad Reciente
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
              <p className="text-beige/80">Nuevo pedido recibido (#1024)</p>
              <span className="text-beige/40 ml-auto">Hace 5 min</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
              <p className="text-beige/80">Pedido #1023 entregado</p>
              <span className="text-beige/40 ml-auto">Hace 15 min</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
              <p className="text-beige/80">Stock bajo: Leño Hawaiano</p>
              <span className="text-beige/40 ml-auto">Hace 1 hora</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
