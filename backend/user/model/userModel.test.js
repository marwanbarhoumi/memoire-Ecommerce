const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userModel = require("../model/User"); 

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
  // Nettoyer toutes les collections après chaque test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe("User Model", () => {
  it("should create & save a user successfully", async () => {
    const validUser = new userModel({
      firstname: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      phone: 1234567890,
      adresse: "456 Street",
      password: "safePassword",
      birthDate: new Date("1995-05-15"),
      img: "avatar.png",
      role: "client",
    });

    const savedUser = await validUser.save();

    // Vérifie que le document a un _id
    expect(savedUser._id).toBeDefined();

    // Vérifie les valeurs stockées
    expect(savedUser.firstname).toBe("Alice");
    expect(savedUser.isBan).toBe(false); // valeur par défaut
    expect(savedUser.role).toBe("client");
    expect(savedUser.createAt).toBeInstanceOf(Date);
  });

  it("should throw validation error for invalid role", async () => {
    const invalidUser = new userModel({
      firstname: "Bob",
      role: "superadmin", // valeur invalide, pas dans enum
    });

    let error;
    try {
      await invalidUser.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.role).toBeDefined();
  });

  it("should set default 'createAt' date", () => {
    const user = new userModel();
    expect(user.createAt).toBeInstanceOf(Date);
  });
});
