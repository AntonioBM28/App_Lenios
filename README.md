# Leños Rellenos — Frontend

> React + Vite + TypeScript · Artisanal food ordering app

## 🚀 Quick Start

```bash
# 1. Copy env file
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🐳 Docker

This app has its own optimized multi-stage `Dockerfile` (Node build → static files served by Nginx, with SPA routing configured in `nginx.conf`). Build args (`VITE_API_URL`, `VITE_WHATSAPP_NUMBER`, etc.) are baked into the bundle at build time, since Vite embeds `VITE_*` vars statically.

To build and run standalone:

```bash
docker build -t lenos-web \
  --build-arg VITE_API_URL=http://localhost:3000 \
  .
docker run -p 5173:80 lenos-web
```

To spin up the **full stack** (this FrontEnd + the NestJS API + a local Postgres) with one command, see `docker-compose.yml` in the [`API_Lenios`](../API_Lenios) repo — it expects this repo to be cloned as a sibling folder (`../App_Lenios`).

---

## ⚙️ CI/CD (GitHub Actions)

| Workflow | Trigger | What it does |
|---|---|---|
| `.github/workflows/ci.yml` | PR into `develop` or `main` | `npm ci` → lint → tests (Vitest) → build |
| `.github/workflows/cd.yml` | Push to `main` (PR merge) | Re-runs test+build, then triggers the Render deploy hook |

**One-time setup (once this repo is on GitHub):**

1. Create a **Static Site** on [Render](https://render.com) (free) pointing to this repo — build command `npm run build`, publish directory `dist`.
2. Set the `VITE_*` env vars there (same names as `.env.example`).
3. In the site → **Settings → Deploy Hook**, copy the URL.
4. In GitHub: `Settings → Secrets and variables → Actions → New repository secret` → name `RENDER_DEPLOY_HOOK_URL`, value = that URL.

---

## 📁 Project Structure

```
src/
├── app/                   # App shell, router, providers
│   ├── App.tsx            # Root component (mounts providers + router)
│   └── router.tsx         # Route definitions (react-router-dom v6)
│
├── shared/                # Cross-feature, reusable code
│   ├── components/        # "Dumb" UI components (Button, Card, Navbar, Layout…)
│   ├── hooks/             # Generic hooks (useMediaQuery…)
│   ├── utils/             # Pure helpers (formatCurrency, truncate…)
│   └── types/             # Shared TypeScript domain types
│
├── core/                  # Infrastructure concerns
│   ├── api/
│   │   ├── httpClient.ts  # Axios instance (baseURL from VITE_API_URL)
│   │   └── endpoints.ts   # All API route constants
│   └── config/
│       └── env.ts         # Typed environment variable reader
│
├── features/              # One folder per business domain
│   ├── home/pages/        # Landing page (hero + featured)
│   ├── menu/              # Product catalog
│   │   ├── components/    # MenuCard, CategoryFilter (TBD)
│   │   ├── hooks/         # useMenu() — fetches from service
│   │   ├── services/      # IMenuService + MockMenuService
│   │   ├── types/         # Service interface
│   │   └── pages/         # MenuPage
│   ├── cart/              # Shopping cart
│   │   ├── store/         # Zustand store (persisted to localStorage)
│   │   ├── types/         # CartState interface
│   │   └── pages/         # CartPage
│   ├── about/pages/       # Nosotros page
│   ├── contact/pages/     # Contacto page
│   └── admin/             # Admin dashboard (auth + features TBD)
│       └── pages/
│
└── assets/                # Static images, logos
```

---

## 🏛 Architecture & Layer Pattern

Each **feature** is self-contained:

```
feature/
  components/   → presentational only, no data fetching
  hooks/        → data + state coordination (calls services)
  services/     → data access abstraction (interface + implementations)
  types/        → feature-specific TS types
  pages/        → route-level components (compose hooks + components)
```

### Data Abstraction

Services expose a **TypeScript interface** (`IMenuService`). Currently, `MockMenuService` fulfills it with static data. When the NestJS backend is ready:

1. Create `HttpMenuService implements IMenuService` using `httpClient` from `core/api`.
2. Swap the singleton export in `services/menuService.ts`.
3. No component code changes needed.

---

## 🔌 Connecting to the NestJS Backend

1. Set `VITE_API_URL` in your `.env` to the NestJS URL (e.g., `http://localhost:3000/api`).
2. Add/update API routes in `src/core/api/endpoints.ts`.
3. Replace mock service implementations with HTTP services using `httpClient`.

---

## 🛒 Cart Store

Powered by **Zustand** with the `persist` middleware. Cart data is automatically saved to `localStorage` under the key `lenios-cart` and rehydrated on page load.

```ts
const { items, addItem, removeItem, updateQuantity, clear, clear, total } = useCartStore()
```

---

## 🎨 Design System

Tokens are defined as CSS custom properties in `src/index.css` (via Tailwind v4 `@theme`):

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#F97316` | Main orange |
| `--color-secondary` | `#EA580C` | Hover/dark orange |
| `--color-wood` | `#7A3E12` | Dark brown accents |
| `--color-beige` | `#D9B382` | Body text |
| `--color-dark-bg` | `#0F0A06` | Page background |
| `--font-heading` | Poppins | Titles, headings |
| `--font-body` | Inter | Body text |

---

## 🧰 Tech Stack

| Tool | Purpose |
|---|---|
| Vite + React + TypeScript | Build tool + UI framework |
| Tailwind CSS v4 | Utility-first styling with custom theme tokens |
| react-router-dom v6 | Client-side routing |
| Zustand | Global state (cart) with localStorage persistence |
| Axios | HTTP client (pre-configured in `core/api/httpClient.ts`) |
| lucide-react | Icon library |
| ESLint + Prettier | Code quality + formatting |

---

## 📋 Available Routes

| Path | Page |
|---|---|
| `/` | HomePage (hero + featured) |
| `/menu` | MenuPage (product catalog) |
| `/cart` | CartPage (order summary) |
| `/about` | AboutPage (Nosotros) |
| `/contact` | ContactPage |
| `/admin` | AdminDashboardPage (placeholder) |

---

## 🔧 Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```
