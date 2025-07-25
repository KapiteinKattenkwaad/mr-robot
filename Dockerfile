# Use Node.js LTS version as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose the port if needed
# EXPOSE 3000

# Set the health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "process.exit(0)"

# Set the entrypoint
ENTRYPOINT ["node", "dist/index.js"]

# Default command
CMD []