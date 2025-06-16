# Utilise une image Node Alpine officielle
FROM node:20-alpine

# Configuration de l'environnement
ENV NODE_ENV=production
ENV PORT=7000

# Crée un dossier de travail sécurisé
RUN mkdir -p /usr/src/app && chown node:node /usr/src/app
WORKDIR /usr/src/app

# Installation des dépendances
COPY --chown=node:node package*.json ./
RUN npm ci --only=production

# Copie de l'application
COPY --chown=node:node . .

# Utilisateur non-root pour la sécurité
USER node

# Exposition du port
EXPOSE 7000

# Commande de démarrage
CMD ["node", "gateway.js"]