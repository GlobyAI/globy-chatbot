# ─── DEV / RUN‐LOCAL DOCKERFILE ──────────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

# 1) Copy only package files and install dependencies
COPY package*.json ./
RUN npm install

# 2) Copy the rest of your source code
COPY . .

# 3) Expose the port that "npm start" will listen on
EXPOSE 5173

# 4) Launch the dev server
CMD ["npm", "run","dev"]