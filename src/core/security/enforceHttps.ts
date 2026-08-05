/**
 * Seguridad en el navegador y transporte: fuerza HTTPS en producción.
 *
 * Si el build de producción se sirve accidentalmente por HTTP (ej. un
 * hosting mal configurado, o alguien pega el link sin "https://"), el JWT
 * de sesión del admin y los datos de los clientes viajarían sin cifrar.
 * Esta función redirige de inmediato a la versión https:// de la misma URL.
 *
 * Se excluye "localhost" explícitamente para no romper pruebas locales de
 * un build de producción (`npm run build && npm run preview`), donde no
 * hay TLS y no tiene sentido forzarlo.
 */
export function enforceHttps(): void {
  const isProd = import.meta.env.PROD
  const isInsecure = window.location.protocol === 'http:'
  const isLocalhost = window.location.hostname === 'localhost'

  if (!isProd || !isInsecure || isLocalhost) return

  const secureUrl = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`

  // replace() en vez de asignar location.href: no deja la URL insegura
  // en el historial de navegación (evita que "atrás" regrese a http://).
  window.location.replace(secureUrl)
}
