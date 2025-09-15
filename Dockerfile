# Multi-stage build for better security and smaller image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# Also copy the .npmrc file if it exists
COPY package*.json ./

# Install application dependencies
# Use --frozen-lockfile to ensure reproducible installs
RUN npm ci

# Copy the rest of the application source code to the working directory
COPY . .

# Build the Next.js application for production
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Make port 3000 available to the world outside this container
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Define the command to run the app
CMD ["node", "server.js"]
