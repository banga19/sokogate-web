# ============================================================================
# Stage 1: Build the Vue.js application
# ============================================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files for layer caching
COPY package.json ./
COPY yarn.lock* ./
COPY .yarnrc* ./

# Install ALL dependencies (devDependencies needed for build)
RUN yarn install --frozen-lockfile

# Copy all source files
COPY . .

# Build for production
# VUE_APP_* env vars can be passed as --build-arg if needed
RUN yarn build

# ============================================================================
# Stage 2: Serve with Nginx
# ============================================================================
FROM nginx:1.25-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Security: remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.bak

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
