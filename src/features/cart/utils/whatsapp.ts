import type { CartItem } from '@/shared/types'
import { formatCurrency } from '@/shared/utils'

export interface DatosEntrega {
  nombre: string
  telefono: string
  direccion: string
}

/**
 * Arma un mensaje de texto para WhatsApp con los detalles del pedido.
 * Es una función pura y testeable.
 */
export function buildWhatsappMessage(
  items: CartItem[],
  datosEntrega: DatosEntrega,
  total: number
): string {
  const lineas: string[] = []

  lineas.push('¡Hola! 👋 Nuevo pedido.')
  lineas.push(`Cliente: ${datosEntrega.nombre}`)
  lineas.push(`Dirección: ${datosEntrega.direccion}`)
  lineas.push(`Teléfono: ${datosEntrega.telefono}`)
  lineas.push('Detalle:')

  items.forEach((item) => {
    lineas.push(`- ${item.cantidad}x ${item.nombre}`)
  })

  lineas.push(`Total: ${formatCurrency(total)}`)

  return encodeURIComponent(lineas.join('\n'))
}
