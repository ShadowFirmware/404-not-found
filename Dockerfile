# ── Etapa 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Variables de Vite se embeben en el bundle durante el build
ARG VITE_API_URL
ARG VITE_SOCKET_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# ── Etapa 2: Servir ───────────────────────────────────────────────────────────
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/dist ./dist

# Railway asigna $PORT dinámicamente
EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -p ${PORT:-3000}"]
