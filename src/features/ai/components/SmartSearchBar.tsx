import { useState, type FormEvent } from 'react'
import { Sparkles, X, Loader2 } from 'lucide-react'

interface SmartSearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  loading: boolean
  /** true cuando ya hay una búsqueda con resultados/errores activa */
  active: boolean
}

/**
 * Buscador inteligente del menú: el cliente describe en lenguaje natural
 * lo que se le antoja y MenuPage manda esa query a POST /ai/smart-search
 * (Groq). Este componente solo maneja el input — el estado de resultados
 * vive en useSmartSearch, en el padre.
 */
export function SmartSearchBar({ onSearch, onClear, loading, active }: SmartSearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-btn px-4 py-3 focus-within:border-primary transition-colors">
        <Sparkles size={18} className="text-primary shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué se te antoja? Ej. algo picante y barato para compartir"
          className="flex-1 min-w-0 bg-transparent text-white text-sm placeholder:text-beige/40 focus:outline-none"
          disabled={loading}
          aria-label="Buscar en el menú con IA"
        />
        {active ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-beige/50 hover:text-white transition-colors shrink-0"
            aria-label="Limpiar búsqueda"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-secondary transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-primary"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Buscar
          </button>
        )}
      </div>
    </form>
  )
}
