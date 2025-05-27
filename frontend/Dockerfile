FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 9090  # Port pour les métriques Prometheus
CMD ["npm", "start"]