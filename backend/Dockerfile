# ============================================================================
# Node.js API Backend
# ============================================================================
# To pin by digest: docker pull node:22-alpine && docker inspect node:22-alpine --format='{{index .RepoDigests 0}}'
FROM node:22-alpine

RUN apk add --no-cache postgresql-client

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
  && mkdir -p /app/logs

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN chmod +x docker-entrypoint.sh && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
