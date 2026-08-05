import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { enforceHttps } from './core/security/enforceHttps'
// Import de solo efecto secundario: valida VITE_API_URL en producción
// (lanza si no es https://) antes de que se monte cualquier componente.
import './core/config/env'

// Seguridad en el navegador y transporte: lo primero que corre la app.
enforceHttps()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
