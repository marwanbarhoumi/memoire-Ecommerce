# Utilise une image Node officielle
FROM node:20-alpine

# Crée un dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers nécessaires
COPY package*.json ./
RUN npm install

# Copie le reste des fichiers de l'application
COPY . .

# Expose le port utilisé par le Gateway
EXPOSE 7000

# Commande de lancement
CMD ["node", "gateway.js"]
