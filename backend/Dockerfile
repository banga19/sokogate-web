FROM node:20-alpine

WORKDIR /app

# Install production dependencies first (for better caching)
COPY package.json ./
RUN yarn install --production --frozen-lockfile

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

EXPOSE 3000

CMD ["node", "src/server.js"]
