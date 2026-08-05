import { AlertTriangle, Power } from 'lucide-react'

interface ManualOverrideToggleProps {
  cierreManual: boolean
  onChange: (valor: boolean) => void
}

export function ManualOverrideToggle({ cierreManual, onChange }: ManualOverrideToggleProps) {
  return (
    <div className={`border rounded-xl shadow-xl overflow-hidden transition-colors duration-300 ${cierreManual ? 'bg-red-950/20 border-red-500/30' : 'bg-dark-card border-dark-border'}`}>
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        <div className="flex gap-4 items-start">
          <div className={`p-3 rounded-full mt-1 flex-shrink-0 transition-colors duration-300 ${cierreManual ? 'bg-red-500/20 text-red-500' : 'bg-dark-border text-beige/50'}`}>
            <Power size={24} />
          </div>
          <div>
            <h2 className={`text-lg font-heading font-bold mb-1 transition-colors duration-300 ${cierreManual ? 'text-red-400' : 'text-white'}`}>
              Cierre Manual (Apagar negocio)
            </h2>
            <p className="text-sm text-beige/70 leading-relaxed max-w-xl">
              Si activas este interruptor, el negocio aparecerá como <strong>CERRADO</strong> para los clientes inmediatamente, sin importar el horario o el día. Utilízalo en emergencias o si te quedas sin inventario antes de tiempo.
            </p>
            
            {cierreManual && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full inline-flex">
                <AlertTriangle size={14} /> El negocio se encuentra cerrado manualmente
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center cursor-pointer relative shrink-0 scale-125">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={cierreManual}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className="w-11 h-6 bg-dark-bg peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 border border-dark-border"></div>
        </label>

      </div>
    </div>
  )
}
