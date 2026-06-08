# --- Etapa 1: Construcción (Build) ---
FROM node:22-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (Solo producción para evitar Electron en Docker)
RUN npm install --omit=dev

# Copiar el resto del código y construir la app
COPY . .
RUN npm run build

# --- Etapa 2: Producción (Servidor Nginx) ---
FROM nginx:stable-alpine

# Copiar los archivos estáticos desde la etapa de build
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de nginx si fuera necesario (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
