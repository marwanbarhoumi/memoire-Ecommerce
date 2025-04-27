# Utiliser une image Node.js officielle légère
FROM node:20-alpine

# Créer le dossier app
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install 

# Copier tout le code source
COPY . .

# Exposer le port de ton app
EXPOSE 7002

# Lancer le serveur
CMD ["node", "server.js"]
