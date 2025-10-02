# Use official Node.js LTS image
FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prod

# Copy the rest of the source code
COPY . .

# Set env and expose port
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
