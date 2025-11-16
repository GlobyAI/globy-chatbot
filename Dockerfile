# Dockerfile
FROM node:22-alpine

WORKDIR /app

# 1. Copy package files và cài deps
COPY package*.json ./
RUN npm ci --omit=dev

# 2. Copy source code
COPY . .

# 3. Build app (react-router build)
RUN npm run build

# 4. Set env cho server
ENV NODE_ENV=production
ENV PORT=3004

# 5. Expose port trong container
EXPOSE 3004

# 6. Chạy server: react-router-serve ./build/server/index.js
CMD ["npm", "start"]
