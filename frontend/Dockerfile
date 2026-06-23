# ============================================================================
# Stage 1: Build the Vue.js application
# ============================================================================
# To pin by digest: docker pull node:22-alpine && docker inspect node:22-alpine --format='{{index .RepoDigests 0}}'
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency files for layer caching
COPY package.json yarn.lock ./

# Install ALL dependencies (devDependencies needed for build)
RUN yarn install --frozen-lockfile --network-timeout 300000

# Copy all source files
COPY . .

# Build for production
# VUE_APP_* env vars can be passed as --build-arg if needed
RUN yarn build

# ============================================================================
# Stage 2: Serve with Nginx
# ============================================================================
# To pin by digest: docker pull nginx:1.25-alpine && docker inspect nginx:1.25-alpine --format='{{index .RepoDigests 0}}'
FROM nginx:1.25-alpine

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Security: remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.bak

# Security: run as non-root user
# Note: nginx:alpine runs its main process as root for port 80 binding, then drops
# privileges to the 'nginx' user for worker processes. Adding USER nginx here would
# prevent binding to port 80. For full non-root hardening, see the nginx.conf port change.
# To enable: change nginx.conf listen port to 8080, uncomment USER below, and change EXPOSE.
# USER nginx

# Health check - Nginx serves /health directly (configured in nginx.conf)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
