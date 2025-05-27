import { Gauge, Counter } from 'prom-client';

export const metrics = {
  pageLoad: new Gauge({
    name: 'frontend_page_load_seconds',
    help: 'Temps de chargement des pages',
    labelNames: ['page_name']
  }),
  errors: new Counter({
    name: 'frontend_errors_total',
    help: 'Total des erreurs frontend',
    labelNames: ['error_type']
  })
};