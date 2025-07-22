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

# Install serve which is better for SPAs
RUN npm install -g serve

# Copy built app
COPY --from=builder /app/dist/estoque-app/browser ./public

# Expose port 8080
EXPOSE 8080

# Start the server with SPA fallback (serve automatically handles SPA routing)
CMD ["serve", "-s", "public", "-l", "8080"]
