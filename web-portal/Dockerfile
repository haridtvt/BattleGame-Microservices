FROM node:18-alpine AS builder
WORKDIR /opt/web

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build && ls -la dist/


FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /opt/web/dist /usr/share/nginx/html/
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]