/**
 * API endpoint constants.
 * All paths are relative to the base URL configured in httpClient.ts.
 *
 * Nota: products/orders no tienen un prefijo /admin/* separado — son las
 * mismas rutas que el catálogo/checkout público, protegidas por AdminGuard
 * del lado del backend según el método HTTP (ver README de API_Lenios).
 */
export const ENDPOINTS = {
  // Menu / products
  MENU_PRODUCTS:         '/products',
  MENU_PRODUCT_BY_ID:    (id: string) => `/products/${id}`,
  PRODUCT_STOCK:         (id: string) => `/products/${id}/stock`,
  MENU_CATEGORIES:       '/categories',

  // Orders
  ORDERS:                '/orders',
  ORDER_BY_ID:           (id: string) => `/orders/${id}`,
  ORDER_STATUS:          (id: string) => `/orders/${id}/status`,

  // Business hours
  BUSINESS_HOURS:        '/business-hours',
  BUSINESS_HOURS_STATUS: '/business-hours/status',

  // Auth
  ADMIN_LOGIN:           '/auth/admin/login',

  // AI (Groq) — buscador inteligente del menú + Sugerencia del Chef
  AI_SMART_SEARCH:       '/ai/smart-search',
  AI_CHEF_SUGGESTION:    '/ai/chef-suggestion',
} as const
