# =============================================================
# GArepasMenu — imagen de produccion
# Build de Vite + nginx sirviendo el estatico.
# La URL del backend se inyecta en runtime (variable API_URL).
# =============================================================

# ---------- Etapa de build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Etapa de runtime ----------
FROM nginx:alpine
# Puerto por defecto si alguien corre el contenedor sin PORT.
ENV PORT=8080

# nginx sustituye ${PORT} al arrancar (plantilla envsubst oficial).
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Escribe config.js con la URL del backend antes de arrancar nginx.
COPY docker-entrypoint.d/10-config.sh /docker-entrypoint.d/10-config.sh
RUN chmod +x /docker-entrypoint.d/10-config.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
