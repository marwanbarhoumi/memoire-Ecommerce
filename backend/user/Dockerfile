FROM node:20

# Créer un dossier pour ton app
WORKDIR /app

# Copier seulement package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du projet
COPY . .

# Exposer le port de ton service (ex: 5000)
EXPOSE 5000

# Démarrer l'app
CMD ["npm", "start"]
