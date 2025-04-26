# Utiliser une image Node officielle
FROM node:20-alpine

# Créer le dossier app
WORKDIR /app

# Copier package.json et installer les deps
COPY package*.json ./
RUN npm install --only=production

# Copier le reste du code
COPY . .

# Exposer le port utilisé par ton service (ex: 3000)
EXPOSE 3000

# Commande pour démarrer l'app
CMD ["node", "server.js"]
