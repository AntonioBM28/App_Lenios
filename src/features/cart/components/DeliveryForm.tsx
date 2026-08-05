import { useForm } from 'react-hook-form'
import { PrivacyNoticeSummary } from '@/features/privacy/components/PrivacyNoticeSummary'

export interface DeliveryFormData {
  nombre: string
  telefono: string
  direccion: string
  consentimiento: boolean
}

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormData) => void
  disabled?: boolean
}

export function DeliveryForm({ onSubmit, disabled = false }: DeliveryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryFormData>()

  return (
    <form
      id="delivery-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 p-6 rounded-card bg-dark-card border border-dark-border"
    >
      <h2 className="font-heading font-semibold text-white text-lg border-b border-dark-border pb-3 mb-2">
        Datos de Entrega
      </h2>

      <PrivacyNoticeSummary />

      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="nombre" className="text-sm font-medium text-beige/80">
          Nombre completo
        </label>
        <input
          id="nombre"
          type="text"
          placeholder="Ej. Juan Pérez"
          className={[
            'w-full px-4 py-2.5 rounded-btn bg-dark-bg border text-white text-sm transition-colors focus:outline-none focus:ring-1',
            errors.nombre
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-dark-border focus:border-primary focus:ring-primary',
          ].join(' ')}
          {...register('nombre', {
            required: 'El nombre es obligatorio',
            minLength: {
              value: 2,
              message: 'El nombre debe tener al menos 2 caracteres',
            },
          })}
          disabled={disabled}
        />
        {errors.nombre && (
          <span className="text-red-400 text-xs">{errors.nombre.message}</span>
        )}
      </div>

      {/* Teléfono */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="telefono" className="text-sm font-medium text-beige/80">
          Teléfono (WhatsApp)
        </label>
        <input
          id="telefono"
          type="tel"
          placeholder="10 dígitos numéricos"
          className={[
            'w-full px-4 py-2.5 rounded-btn bg-dark-bg border text-white text-sm transition-colors focus:outline-none focus:ring-1',
            errors.telefono
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-dark-border focus:border-primary focus:ring-primary',
          ].join(' ')}
          {...register('telefono', {
            required: 'El teléfono es obligatorio',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Debe ser un número válido de 10 dígitos',
            },
          })}
          disabled={disabled}
        />
        {errors.telefono && (
          <span className="text-red-400 text-xs">{errors.telefono.message}</span>
        )}
      </div>

      {/* Dirección */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="direccion" className="text-sm font-medium text-beige/80">
          Dirección de entrega
        </label>
        <textarea
          id="direccion"
          rows={3}
          placeholder="Calle, número, colonia, referencias..."
          className={[
            'w-full px-4 py-2.5 rounded-btn bg-dark-bg border text-white text-sm transition-colors focus:outline-none focus:ring-1 resize-none',
            errors.direccion
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-dark-border focus:border-primary focus:ring-primary',
          ].join(' ')}
          {...register('direccion', {
            required: 'La dirección es obligatoria',
            minLength: {
              value: 5,
              message: 'Ingresa una dirección más detallada',
            },
          })}
          disabled={disabled}
        />
        {errors.direccion && (
          <span className="text-red-400 text-xs">{errors.direccion.message}</span>
        )}
      </div>
      
      {/* Consentimiento explícito — casilla NO pre-marcada (Aviso de Privacidad) */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-dark-border">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            id="consentimiento"
            className={[
              'mt-0.5 w-4 h-4 shrink-0 rounded bg-dark-bg accent-primary cursor-pointer',
              errors.consentimiento ? 'ring-1 ring-red-500' : '',
            ].join(' ')}
            {...register('consentimiento', {
              required: 'Debes aceptar el Aviso de Privacidad para poder enviar tu pedido',
            })}
            disabled={disabled}
          />
          <span className="text-xs text-beige/80 leading-relaxed">
            He leído y acepto el Aviso de Privacidad y autorizo que mis datos se usen
            para procesar mi pedido.
          </span>
        </label>
        {errors.consentimiento && (
          <span className="text-red-400 text-xs">{errors.consentimiento.message}</span>
        )}
      </div>

      {/* Botón oculto, el submit se disparará desde el CartSummary usando form="delivery-form" */}
      <button type="submit" className="hidden" />
    </form>
  )
}
