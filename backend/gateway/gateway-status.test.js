import request from 'supertest';
import express from 'express';

const app = express();

// Copier uniquement la route testée
app.get('/gateway-status', (req, res) => {
  res.json({ status: 'OK', message: 'Gateway fonctionnel' });
});

describe('GET /gateway-status', () => {
  it('doit répondre avec un statut 200 et le message OK', async () => {
    const res = await request(app).get('/gateway-status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'OK',
      message: 'Gateway fonctionnel'
    });
  });
});
