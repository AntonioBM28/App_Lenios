import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/shared/components/Modal'
import { menuService } from '@/features/menu/services/menuService'
import type { Producto, Categoria } from '@/shared/types'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Producto, 'id'>) => Promise<void>
  productToEdit?: Producto | null
}

interface FormData {
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoriaId: string
  imagenUrl: string
  disponible: boolean
  destacado: boolean
}

export function ProductFormModal({ isOpen, onClose, onSave, productToEdit }: ProductFormModalProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  // Cargar categorías
  useEffect(() => {
    if (isOpen) {
      menuService.getCategorias().then(setCategorias).catch(console.error)
    }
  }, [isOpen])

  // Precargar datos si es edición
  useEffect(() => {
    if (isOpen && productToEdit) {
      reset({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        categoriaId: productToEdit.categoriaId,
        imagenUrl: productToEdit.imagenUrl,
        disponible: productToEdit.disponible,
        destacado: productToEdit.destacado || false,
      })
    } else if (isOpen) {
      reset({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        categoriaId: '',
        imagenUrl: '',
        disponible: true,
        destacado: false,
      })
    }
  }, [isOpen, productToEdit, reset])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await onSave({
        ...data,
        // Asegurarse de que precio y stock son números
        precio: Number(data.precio),
        stock: Number(data.stock),
      })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-beige/80">Nombre</label>
          <input
            {...register('nombre', { required: 'El nombre es obligatorio', minLength: 2 })}
            className="w-full px-4 py-2 rounded-btn bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-primary"
            placeholder="Ej. Leño Clásico"
          />
          {errors.nombre && <span className="text-red-400 text-xs">{errors.nombre.message}</span>}
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-beige/80">Descripción</label>
          <textarea
            {...register('descripcion', { required: 'La descripción es obligatoria' })}
            rows={2}
            className="w-full px-4 py-2 rounded-btn bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-beige/80">Precio (MXN)</label>
            <input
              type="number"
              step="0.01"
              {...register('precio', { required: 'Requerido', min: { value: 1, message: 'Mayor a 0' } })}
              className="w-full px-4 py-2 rounded-btn bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-primary"
            />
            {errors.precio && <span className="text-red-400 text-xs">{errors.precio.message}</span>}
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-beige/80">Categoría</label>
            <select
              {...register('categoriaId', { required: 'Requerida' })}
              className="w-full px-4 py-2 rounded-btn bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-primary appearance-none"
            >
              <option value="">Selecciona...</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errors.categoriaId && <span className="text-red-400 text-xs">{errors.categoriaId.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Stock */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-beige/80">Stock inicial</label>
            <input
              type="number"
              {...register('stock', { required: 'Requerido', min: { value: 0, message: 'No puede ser negativo' } })}
              className="w-full px-4 py-2 rounded-btn bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-primary"
            />
            {errors.stock && <span className="text-red-400 text-xs">{errors.stock.message}</span>}
          </div>

          {/* Imagen URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-beige/80">URL Imagen</label>
            <input
              {...register('imagenUrl', { required: 'Requerida' })}
              className="w-full px-4 py-2 rounded-btn bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-primary"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('disponible')} className="rounded border-dark-border text-primary focus:ring-primary bg-dark-bg" />
            <span className="text-sm text-white">Activo / Visible</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('destacado')} className="rounded border-dark-border text-primary focus:ring-primary bg-dark-bg" />
            <span className="text-sm text-white">Destacado (Home)</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-dark-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-btn text-sm font-semibold text-white bg-dark-bg border border-dark-border hover:bg-dark-border transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-btn text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
