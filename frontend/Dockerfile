FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ✅ Corrige le bug openssl
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build

# Puis ton stage de production si tu en as un
