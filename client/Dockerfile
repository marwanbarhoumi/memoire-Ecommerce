# Utiliser une image officielle Node
FROM node:20-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application React
CMD ["npm", "start"]
