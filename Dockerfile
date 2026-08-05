# syntax=docker/dockerfile:1

# ──────────────────────────────────────────────────────────────────────────
# Leños Rellenos — Dockerfile multi-stage (React + Vite → estático en Nginx)
#
# 2 etapas:
#   1. build  → instala deps, compila TS y genera el bundle estático (dist/)
#   2. runtime → nginx:alpine sirviendo solo los archivos estáticos
#      (imagen final ~25MB, sin Node ni node_modules)
#
# Las variables VITE_* se "hornean" en el bundle en tiempo de BUILD (Vite
# las reemplaza como texto plano), no en runtime — por eso se reciben aquí
# como build args y docker-compose.yml las inyecta con `build.args`.
# ──────────────────────────────────────────────────────────────────────────

FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:3000
ARG VITE_WHATSAPP_NUMBER=524181873720
ARG VITE_CONTACT_EMAIL=contacto@lenosrellenos.com
ARG VITE_USE_MOCK_DATA=false
ARG VITE_USE_COOKIE_AUTH=false
ENV VITE_API_URL=$VITE_API_URL \
    VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER \
    VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL \
    VITE_USE_MOCK_DATA=$VITE_USE_MOCK_DATA \
    VITE_USE_COOKIE_AUTH=$VITE_USE_COOKIE_AUTH

RUN npm run build

# ── Etapa final: runtime ────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
