/**
 * Typed environment variables.
 * All vars must be prefixed with VITE_ to be exposed by Vite.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER as string,
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL as string,
  // Flag de preparación para una futura migración a cookies httpOnly.
  // Hoy siempre es false — ver TODO en core/api/httpClient.ts.
  useCookieAuth: import.meta.env.VITE_USE_COOKIE_AUTH === 'true',
  isDev: import.meta.env.DEV as boolean,
  isProd: import.meta.env.PROD as boolean,
} as const

/**
 * Seguridad en el navegador y transporte: falla rápido y de forma visible
 * si un build de PRODUCCIÓN queda apuntando a un backend sin TLS.
 *
 * Sin esta validación, un despliegue accidental con VITE_API_URL=http://...
 * enviaría el PIN de admin, el JWT de sesión y los datos de los clientes
 * (nombre, teléfono, dirección) en texto plano por la red. Es preferible
 * que el build truene aquí a que ese tráfico salga sin cifrar.
 *
 * En desarrollo (DEV) no se valida nada: http://localhost sigue funcionando
 * como siempre.
 *
 * Excepción: un build de producción (Vite) que apunta a localhost/127.0.0.1
 * también se acepta sin HTTPS. Esto ocurre al levantar el contenedor del
 * frontend con `docker compose up --build` para pruebas locales: Vite marca
 * el build como PROD aunque nunca salga de la máquina, así que exigir HTTPS
 * ahí no aporta seguridad real (el tráfico no sale a la red) y solo rompe
 * las pruebas de contenerización.
 */
function isLocalHost(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return false
  }
}

function validateProductionEnv(): void {
  if (!env.isProd) return
  if (env.apiUrl?.startsWith('https://')) return
  if (isLocalHost(env.apiUrl)) return

  const message =
    `Configuración insegura: VITE_API_URL debe iniciar con "https://" en producción. ` +
    `Valor actual: "${String(env.apiUrl)}". Corrige la variable de entorno antes de desplegar.`

  // eslint-disable-next-line no-console
  console.error(`[Seguridad] ${message}`)

  // Mensaje visible además del error en consola — un build mal configurado
  // no debe verse como una página en blanco silenciosa.
  if (typeof document !== 'undefined' && document.body) {
    const overlay = document.createElement('div')
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;' +
      'justify-content:center;padding:2rem;text-align:center;' +
      'background:#1C110A;color:#fff;font-family:system-ui,sans-serif;'

    const title = document.createElement('h1')
    title.style.cssText = 'color:#F97316;margin-bottom:1rem;font-size:1.5rem;'
    title.textContent = 'Configuración insegura detectada'

    const description = document.createElement('p')
    description.style.cssText = 'max-width:32rem;line-height:1.5;'
    description.textContent = message

    const wrapper = document.createElement('div')
    wrapper.appendChild(title)
    wrapper.appendChild(description)
    overlay.appendChild(wrapper)

    document.body.innerHTML = ''
    document.body.appendChild(overlay)
  }

  throw new Error(message)
}

validateProductionEnv()
