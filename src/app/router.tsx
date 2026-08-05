import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
import { AdminAccessGate } from '@/features/admin/auth/AdminAccessGate'
import { AdminLayout } from '@/features/admin/components/AdminLayout'

// Lazy-loaded pages for code splitting (Public)
const HomePage           = lazy(() => import('@/features/home/pages/HomePage'))
const MenuPage           = lazy(() => import('@/features/menu/pages/MenuPage'))
const CartPage           = lazy(() => import('@/features/cart/pages/CartPage'))
const AboutPage          = lazy(() => import('@/features/about/pages/AboutPage'))
const ContactPage        = lazy(() => import('@/features/contact/pages/ContactPage'))
const PrivacyPage        = lazy(() => import('@/features/privacy/pages/PrivacyPage'))

// Lazy-loaded pages for code splitting (Admin)
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'))
const ProductsAdminPage  = lazy(() => import('@/features/admin/pages/ProductsAdminPage'))
const StockAdminPage     = lazy(() => import('@/features/admin/pages/StockAdminPage'))
const OrdersAdminPage    = lazy(() => import('@/features/admin/pages/OrdersAdminPage'))
const HoursAdminPage     = lazy(() => import('@/features/admin/pages/HoursAdminPage'))

/** Full-page loading spinner shown during lazy chunk loading */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-2 border-[var(--color-dark-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
    </div>
  )
}

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: '/',
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <HomePage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/menu',
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <MenuPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/cart',
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <CartPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/about',
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <AboutPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/contact',
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <ContactPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: '/privacy',
    element: (
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <PrivacyPage />
        </Suspense>
      </Layout>
    ),
  },
  // ADMIN ROUTES
  {
    path: '/admin',
    element: (
      <AdminAccessGate>
        <AdminLayout>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </AdminLayout>
      </AdminAccessGate>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'products',
        element: <ProductsAdminPage />,
      },
      {
        path: 'stock',
        element: <StockAdminPage />,
      },
      {
        path: 'orders',
        element: <OrdersAdminPage />,
      },
      {
        path: 'hours',
        element: <HoursAdminPage />,
      },
    ],
  },
])

/** App-level router provider */
export function AppRouter() {
  return <RouterProvider router={router} />
}
