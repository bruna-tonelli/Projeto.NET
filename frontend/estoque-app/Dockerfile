# Stage 1: Build Angular app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to resolve conflicts
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with a simple HTTP server
FROM node:20-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g http-server

# Copy built app
COPY --from=builder /app/dist/estoque-app/browser ./public

# Expose port 8080
EXPOSE 8080

# Start the server with SPA fallback (--push-state redirects all routes to index.html)
CMD ["http-server", "public", "-p", "8080", "--cors", "-a", "0.0.0.0", "--push-state"]
