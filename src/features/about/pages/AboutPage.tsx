import { Heart, Leaf, Award } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
          Nuestra <span className="text-primary">Historia</span>
        </h1>
        <p className="text-beige/70 text-lg leading-relaxed">
          Próximamente: descubre quiénes somos, nuestra pasión por la comida artesanal y el compromiso con la calidad que nos distingue.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Heart, label: 'Hecho con amor', color: 'text-red-400' },
          { icon: Leaf, label: 'Ingredientes frescos', color: 'text-emerald-400' },
          { icon: Award, label: 'Calidad artesanal', color: 'text-primary' },
        ].map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 p-8 rounded-card bg-dark-card border border-dark-border text-center"
          >
            <Icon size={36} className={color} strokeWidth={1.5} />
            <p className="font-heading font-semibold text-white">{label}</p>
            <p className="text-sm text-beige/50">Contenido próximamente</p>
          </div>
        ))}
      </div>
    </div>
  )
}
