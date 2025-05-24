const jwt = require("jsonwebtoken");
const createToken = require("../utils/Token"); // ajuste le chemin si nécessaire

jest.mock("jsonwebtoken");

describe("createToken", () => {
  const FAKE_SECRET = "secretTest";
  const FAKE_TOKEN = "fake.jwt.token";

  beforeEach(() => {
    process.env.jwtCode = FAKE_SECRET;
    jwt.sign.mockReturnValue(FAKE_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("doit créer un token avec le bon payload, secret et expiration", () => {
    const payload = { id: "user123", role: "admin" };

    const token = createToken(payload);

    expect(jwt.sign).toHaveBeenCalledWith(payload, FAKE_SECRET, {
      expiresIn: "1h",
    });
    expect(token).toBe(FAKE_TOKEN);
  });

  it("doit logguer le payload et le token", () => {
    const payload = { id: "logtest" };
    console.log = jest.fn();

    createToken(payload);

    expect(console.log).toHaveBeenCalledWith(payload);
    expect(console.log).toHaveBeenCalledWith(FAKE_TOKEN);
  });
});
