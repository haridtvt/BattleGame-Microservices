FROM node:20-alpine AS builder
LABEL authors="HARI"

ENV DEBIAN_FRONTEND=noninteractive

RUN apk --no-cache add curl

WORKDIR /opt/application-api

COPY package.json .

RUN npm install --production

COPY . .

FROM node:20-alpine AS runner

WORKDIR /opt/application-api

COPY --from=builder /opt/application-api/node_modules ./node_modules
COPY --from=builder /opt/application-api/package.json ./
COPY --from=builder /opt/application-api/server.js ./

EXPOSE 3000

CMD ["node", "server.js"]


