const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const createServer = require('../../server');
const Product = require('../../model/product')

let mongoServer;
let app;
let server;

// Données de test
const testProduct = {
  name: 'Produit Test',
  price: 99.99,
  description: 'Description de test',
  category: 'Test'
};

const updatedProduct = {
  name: 'Produit Modifié',
  price: 149.99,
  description: 'Description modifiée'
};

beforeAll(async () => {
  // Créer un serveur MongoDB en mémoire
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Fermer toute connexion existante et se connecter à la DB de test
  await mongoose.disconnect();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Créer l'application Express pour les tests
  app = createServer();
  server = app.listen(0); // Port aléatoire pour les tests
});

afterAll(async () => {
  // Nettoyage après les tests
  await server.close();
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Nettoyer la base de données avant chaque test
  await Product.deleteMany({});
});

describe('Product Controller', () => {
  describe('POST /api/products', () => {
    it('devrait créer un nouveau produit avec des données valides', async () => {
      const response = await request(server)
        .post('/api/products')
        .send(testProduct)
        .expect(201);

      expect(response.body).toMatchObject({
        name: testProduct.name,
        price: testProduct.price,
        description: testProduct.description,
        category: testProduct.category
      });

      // Vérifier que le produit est bien en base de données
      const productInDb = await Product.findOne({ _id: response.body._id });
      expect(productInDb).toBeTruthy();
    });

    it('devrait retourner une erreur 400 si des champs obligatoires sont manquants', async () => {
      const invalidProduct = { ...testProduct };
      delete invalidProduct.name; // Supprimer le champ obligatoire

      const response = await request(server)
        .post('/api/products')
        .send(invalidProduct)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/products', () => {
    it('devrait retourner tous les produits', async () => {
      // Créer quelques produits de test
      await Product.create([
        testProduct,
        { ...testProduct, name: 'Produit 2' },
        { ...testProduct, name: 'Produit 3' }
      ]);

      const response = await request(server)
        .get('/api/products')
        .expect(200);

      expect(response.body.length).toBe(3);
    });

    it('devrait retourner un tableau vide quand il n\'y a pas de produits', async () => {
      const response = await request(server)
        .get('/api/products')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/products/:id', () => {
    it('devrait retourner un produit spécifique', async () => {
      const createdProduct = await Product.create(testProduct);

      const response = await request(server)
        .get(`/api/products/${createdProduct._id}`)
        .expect(200);

      expect(response.body._id).toBe(createdProduct._id.toString());
      expect(response.body.name).toBe(testProduct.name);
    });

    it('devrait retourner 404 si le produit n\'existe pas', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(server)
        .get(`/api/products/${fakeId}`)
        .expect(404);
    });

    it('devrait retourner 400 pour un ID invalide', async () => {
      await request(server)
        .get('/api/products/invalid-id')
        .expect(400);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('devrait mettre à jour un produit existant', async () => {
      const createdProduct = await Product.create(testProduct);

      const response = await request(server)
        .put(`/api/products/${createdProduct._id}`)
        .send(updatedProduct)
        .expect(200);

      expect(response.body.name).toBe(updatedProduct.name);
      expect(response.body.price).toBe(updatedProduct.price);

      // Vérifier que les modifications sont bien en base
      const updatedInDb = await Product.findById(createdProduct._id);
      expect(updatedInDb.name).toBe(updatedProduct.name);
    });

    it('devrait retourner 404 si le produit à mettre à jour n\'existe pas', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(server)
        .put(`/api/products/${fakeId}`)
        .send(updatedProduct)
        .expect(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('devrait supprimer un produit existant', async () => {
      const createdProduct = await Product.create(testProduct);

      await request(server)
        .delete(`/api/products/${createdProduct._id}`)
        .expect(204);

      // Vérifier que le produit a bien été supprimé
      const deletedProduct = await Product.findById(createdProduct._id);
      expect(deletedProduct).toBeNull();
    });

    it('devrait retourner 404 si le produit à supprimer n\'existe pas', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(server)
        .delete(`/api/products/${fakeId}`)
        .expect(404);
    });
  });

  describe('GET /api/products/health', () => {
    it('devrait retourner le statut du service', async () => {
      const response = await request(server)
        .get('/api/products/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'OK',
        service: 'product-service',
        db: 'connected',
        uploads: 'enabled'
      });
    });
  });
});