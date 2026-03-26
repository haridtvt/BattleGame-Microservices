FROM node:18-alpine AS builder
LABEL authors="HARI"

WORKDIR /opt/web

COPY package.json .

RUN npm install
COPY . .

RUN npm run build

FROM nginx:stable-alpine AS production-stage
WORKDIR /opt/web

USER haridtvt

COPY --from=builder /opt/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



