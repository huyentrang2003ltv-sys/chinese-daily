FROM node:20-alpine
WORKDIR /app

# Copy application files
COPY package*.json ./
COPY . .

# Environment & Port
ENV PORT=3000
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
