# Dockerfile
FROM node:22-alpine

WORKDIR /app

# 1. Copy package files và cài deps
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .


# 5. Expose port trong container
EXPOSE 3004

# 6. Chạy server: react-router-serve ./build/server/index.js
CMD ["npm", "run","dev"]
