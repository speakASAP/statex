FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    sqlite \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Create data and logs directories
RUN mkdir -p data logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S dns-service -u 1001

# Change ownership of the app directory
RUN chown -R dns-service:nodejs /app

# Switch to non-root user
USER dns-service

# Expose ports
EXPOSE 8053 5353

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8053/health || exit 1

# Start the service
CMD ["npm", "start"]
