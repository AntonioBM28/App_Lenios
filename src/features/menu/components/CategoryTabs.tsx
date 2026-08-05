import type { Categoria } from '@/shared/types'

interface CategoryTabsProps {
  categorias: Categoria[]
  activa: string
  onChange: (id: string) => void
}

/**
 * Chips/tabs de filtrado por categoría.
 * Incluye siempre la opción "Todos" como primer elemento.
 */
export function CategoryTabs({ categorias, activa, onChange }: CategoryTabsProps) {
  const tabs = [
    { id: 'todas', nombre: 'Todos' },
    ...categorias,
  ]

  return (
    <div
      role="tablist"
      aria-label="Filtrar por categoría"
      className="flex items-center gap-2 flex-wrap"
    >
      {tabs.map((tab) => {
        const isActive = activa === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            id={`category-tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg',
              isActive
                ? 'bg-primary text-white shadow-glow-primary'
                : 'bg-dark-card border border-dark-border text-beige/70 hover:border-wood hover:text-beige',
            ].join(' ')}
          >
            {tab.nombre}
          </button>
        )
      })}
    </div>
  )
}
