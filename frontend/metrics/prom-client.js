const client = require('prom-client');

// Create metrics
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests received',
  labelNames: ['method', 'route', 'status_code'],
});

// Optional: Collect default Node.js metrics
client.collectDefaultMetrics();

// Create registry
const register = client.register;

// Example middleware for Express.js
function metricsMiddleware(req, res, next) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode
    });
  });
  
  next();
}

// Expose metrics endpoint
function setupMetricsRoute(app) {
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
}

module.exports = {
  httpRequestCounter,
  register,
  metricsMiddleware,
  setupMetricsRoute
};