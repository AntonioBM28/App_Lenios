/**
 * Almacenamiento del token de sesión del admin (RF8).
 *
 * ── Por qué sessionStorage (elección actual) ───────────────────────────────
 * - El negocio tiene un único operador administrando desde un solo
 *   navegador/pestaña — no hay necesidad de "recordarme" entre sesiones.
 * - sessionStorage expira solo al cerrar la pestaña, lo que limita la
 *   ventana de exposición del token sin lógica adicional.
 * - Es la opción más simple de implementar del lado del cliente sin
 *   requerir cambios de contrato con el backend (el login ya devuelve el
 *   JWT en el body de la respuesta, no como cookie).
 *
 * ── Por qué NO localStorage ─────────────────────────────────────────────────
 * - localStorage persiste indefinidamente (sobrevive a cerrar el
 *   navegador), ampliando la ventana en la que un token robado sigue
 *   siendo válido si alguien más usa el mismo equipo.
 *
 * ── Límite de seguridad de AMBOS (sessionStorage y localStorage) ───────────
 * - Cualquier JS que corra en la página puede leer el token — es decir,
 *   son vulnerables a robo vía XSS (un script inyectado podría hacer
 *   `sessionStorage.getItem('lenios_admin_token')` y exfiltrarlo).
 *   Mitigamos el riesgo de XSS en otro frente (React escapa por defecto,
 *   no hay `dangerouslySetInnerHTML` en el proyecto), pero el storage en
 *   sí no ofrece protección adicional contra ese vector.
 *
 * ── Alternativa mejor a futuro: cookie httpOnly ─────────────────────────────
 * - Una cookie marcada httpOnly no puede leerse desde JavaScript (ni
 *   siquiera con XSS activo), lo que elimina ese vector de robo del token.
 * - Requiere coordinación con el backend: el login tendría que emitir el
 *   token vía `Set-Cookie: ...; HttpOnly; Secure; SameSite=Strict` en vez
 *   de devolverlo en el body, y el frontend tendría que mandar
 *   `withCredentials: true` en cada request en vez de adjuntar el header
 *   `Authorization` manualmente.
 * - Esa migración queda fuera de este paso (es un cambio conjunto
 *   front+back); aquí solo se documenta y se deja preparado el httpClient
 *   (ver TODO en core/api/httpClient.ts) para que, cuando se coordine con
 *   backend, el cambio en frontend sea mínimo.
 */
const ADMIN_TOKEN_KEY = 'lenios_admin_token'

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function hasAdminToken(): boolean {
  return getAdminToken() !== null
}
