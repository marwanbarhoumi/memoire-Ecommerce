FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
# Port pour les métriques Prometheus
EXPOSE 9090

CMD ["npm", "start"]
