const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Product = require("../model/product"); // adapte chemin selon ton projet

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe("Product Model", () => {
  it("should create & save a product successfully", async () => {
    const validProduct = new Product({
      name: "Chaussures",
      price: 79.99,
      qtes: 10,
      description: "Chaussures de sport confortables",
      category: "Sport",
      size: ["M", "L"],
      color: ["red", "blue"],
      disponible: true,
      img: "shoes.jpg",
      reviews: [],
      user: new mongoose.Types.ObjectId(),
    });

    const savedProduct = await validProduct.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe("Chaussures");
    expect(savedProduct.price).toBe(79.99);
    expect(savedProduct.qtes).toBe(10);
    expect(savedProduct.description).toBe("Chaussures de sport confortables");
    expect(savedProduct.category).toBe("Sport");
    expect(savedProduct.size).toEqual(expect.arrayContaining(["M", "L"]));
    expect(savedProduct.color).toEqual(expect.arrayContaining(["red", "blue"]));
    expect(savedProduct.disponible).toBe(true);
    expect(savedProduct.img).toBe("shoes.jpg");
    expect(savedProduct.reviews).toHaveLength(0);
    expect(savedProduct.user).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(savedProduct.createdAt).toBeDefined();
    expect(savedProduct.updatedAt).toBeDefined();
  });

  it("should fail to create product without required fields", async () => {
    const productWithoutRequired = new Product({
      // pas de name, price, qtes, category
    });

    let error;
    try {
      await productWithoutRequired.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.name).toBeDefined();
    expect(error.errors.price).toBeDefined();
    expect(error.errors.qtes).toBeDefined();
    expect(error.errors.category).toBeDefined();
  });

  it("should set default values for optional fields", async () => {
    const product = new Product({
      name: "T-shirt",
      price: 19.99,
      qtes: 50,
      category: "Vêtements",
    });

    const saved = await product.save();

    expect(saved.description).toBe("");
    expect(saved.size).toEqual([]);
    expect(saved.color).toEqual([]);
    expect(saved.disponible).toBe(true);
    expect(saved.img).toBe("");
  });
});
