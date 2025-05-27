import { register } from 'prom-client';

export function exposeMetrics() {
  return async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  };
}