# ---- Build stage: compile Tailwind CSS ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tailwind.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build:css

# ---- Runtime stage ----
FROM node:20-alpine
ENV NODE_ENV=production PORT=3005 STORAGE_DIR=/app/storage
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server.js ./
COPY server ./server
COPY scripts/admin.js ./scripts/admin.js
COPY --from=build /app/public ./public
# Accounts, session key and visitor counters live here: mount a volume to keep them.
RUN mkdir -p /app/storage && chown node:node /app/storage
VOLUME ["/app/storage"]
USER node
EXPOSE 3005
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3005/healthz || exit 1
CMD ["node", "server.js"]
