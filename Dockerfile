# Use a lightweight Node.js base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Set and expose the port (adjust if your app uses a different one)
ENV PORT=3000
EXPOSE 3000

# Start the server (adjust entry point if different: app.js / index.js)
CMD ["node", "server.js"]