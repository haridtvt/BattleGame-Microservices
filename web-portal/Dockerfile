FROM node:18-alpine AS builder
WORKDIR /opt/web

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:stable-alpine AS production-stage


COPY --from=builder /opt/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]