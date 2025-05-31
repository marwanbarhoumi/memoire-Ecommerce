const client = require('prom-client');

// Création d'un compteur custom
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status_code'],
});

// Expose le registre par défaut
const register = client.register;

module.exports = {
  httpRequestCounter,
  register,
};
