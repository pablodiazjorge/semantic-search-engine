# Frontend Dockerfile - Angular 17.3.12 / Node.js 20.12.2 / Nginx
# Etapa 1: Build con Node 20.12-bookworm-slim
FROM node:20.12-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist/semantic-search-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
