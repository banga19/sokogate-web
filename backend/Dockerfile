FROM node:20-alpine

WORKDIR /app

# Install all dependencies (sequelize-cli needed for migrations in production)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh && mkdir -p logs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
