import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/features/cart/store/cartStore'
import { httpClient } from '@/core/api/httpClient'
import { ENDPOINTS } from '@/core/api/endpoints'
import type { DeliveryFormData } from '../components/DeliveryForm'
import type { Pedido } from '@/shared/types'

export type CheckoutState = 'idle' | 'processing' | 'success'

interface CreateOrderResponse {
  pedido: Pedido
  mensajeWhatsapp: string
  whatsappUrl: string
}

export function useCheckout() {
  const { items, clear } = useCartStore()
  const [status, setStatus] = useState<CheckoutState>('idle')

  const submitOrder = async (datosEntrega: DeliveryFormData) => {
    if (items.length === 0) return

    setStatus('processing')

    try {
      // El backend valida disponibilidad/stock real, calcula el total,
      // crea el pedido y arma el mensaje de WhatsApp — es la fuente de
      // verdad única (ya no se genera el mensaje en el cliente).
      //
      // consentimientoAceptado es obligatorio en el backend (400 si falta o
      // es false, ver CreateOrderDto) — es la casilla del Aviso de
      // Privacidad que el usuario ya marcó en DeliveryForm.
      const { data } = await httpClient.post<CreateOrderResponse>(ENDPOINTS.ORDERS, {
        cliente: {
          nombre: datosEntrega.nombre,
          telefono: datosEntrega.telefono,
          direccion: datosEntrega.direccion,
        },
        items: items.map((item) => ({
          productoId: item.productId,
          cantidad: item.cantidad,
        })),
        consentimientoAceptado: datosEntrega.consentimiento,
      })

      setStatus('success')

      // El mensaje ya viene codificado (encodeURIComponent) desde el backend.
      window.open(data.whatsappUrl, '_blank')

      // Limpiamos el carrito tras unos segundos para que el usuario pueda
      // empezar de nuevo si vuelve a la pestaña original.
      setTimeout(() => {
        clear()
        setStatus('idle')
      }, 2000)
    } catch (error) {
      // 400 típico: uno o más productos sin disponibilidad/stock suficiente.
      // No limpiamos el carrito ni el formulario para que el usuario pueda
      // ajustar cantidades y reintentar.
      const message =
        error instanceof Error ? error.message : 'No se pudo crear el pedido. Intenta de nuevo.'
      toast.error(message, { duration: 6000 })
      setStatus('idle')
    }
  }

  return {
    status,
    submitOrder,
  }
}
