FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Use distroless for a smaller, more secure runtime image
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# Set production environment and non-root user
ENV NODE_ENV=production
USER nonroot

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["curl", "-f", "http://localhost:${PORT:-3000}/health"]

# Start the app
CMD ["build/main.js"]