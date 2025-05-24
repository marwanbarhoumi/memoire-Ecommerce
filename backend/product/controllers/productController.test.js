const productController = require("../controllers/productController");
const productModel = require("../model/product");

// Mocks Express req, res
const mockRequest = (data) => ({
  body: data.body || {},
  params: data.params || {},
  file: data.file || null,
  user: data.user || { _id: "userId123" },
  protocol: "http",
  get: () => "localhost:3000"
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock mongoose methods
jest.mock("../model/product");

describe("Product Controller", () => {
  afterEach(() => jest.clearAllMocks());

  describe("addProduct", () => {
    it("400 si champs obligatoires manquants", async () => {
      const req = mockRequest({
        body: { name: "", price: "", qtes: "", category: "" }
      });
      const res = mockResponse();

      await productController.addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          msg: expect.stringContaining("obligatoires")
        })
      );
    });

    it("400 si produit existe déjà", async () => {
      productModel.findOne.mockResolvedValue({ name: "ProduitExistant" });

      const req = mockRequest({
        body: { name: "ProduitExistant", price: 10, qtes: 5, category: "Cat1" }
      });
      const res = mockResponse();

      await productController.addProduct(req, res);

      expect(productModel.findOne).toHaveBeenCalledWith({
        name: "ProduitExistant"
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Le produit existe déjà" });
    });

    it("gestion erreur serveur", async () => {
      productModel.findOne.mockRejectedValue(new Error("DB error"));

      const req = mockRequest({
        body: { name: "Prod", price: 10, qtes: 1, category: "Cat" }
      });
      const res = mockResponse();

      await productController.addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, msg: "Erreur serveur" })
      );
    });
  });

  describe("getallproducts", () => {
    it("retourne tous les produits", async () => {
      const fakeProducts = [{ name: "Prod1" }, { name: "Prod2" }];
      productModel.find.mockResolvedValue(fakeProducts);

      const req = mockRequest({});
      const res = mockResponse();

      await productController.getallproducts(req, res);

      expect(productModel.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({ products: fakeProducts });
    });

    it("gestion erreur", async () => {
      productModel.find.mockRejectedValue(new Error("Find error"));

      const req = mockRequest({});
      const res = mockResponse();

      await productController.getallproducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Find error" });
    });
  });

  describe("getoneprod", () => {
    it("retourne produit par id", async () => {
      const fakeProd = { name: "Prod1" };
      productModel.findById.mockResolvedValue(fakeProd);

      const req = mockRequest({ params: { idprod: "abc123" } });
      const res = mockResponse();

      await productController.getoneprod(req, res);

      expect(productModel.findById).toHaveBeenCalledWith("abc123");
      expect(res.json).toHaveBeenCalledWith({ product: fakeProd });
    });

    it("404 si produit non trouvé", async () => {
      productModel.findById.mockResolvedValue(null);

      const req = mockRequest({ params: { idprod: "abc123" } });
      const res = mockResponse();

      await productController.getoneprod(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Produit non trouvé" });
    });

    it("gestion erreur", async () => {
      productModel.findById.mockRejectedValue(new Error("FindById error"));

      const req = mockRequest({ params: { idprod: "abc123" } });
      const res = mockResponse();

      await productController.getoneprod(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "FindById error" });
    });
  });

  describe("updateprod", () => {
    it("met à jour un produit et le retourne", async () => {
      const updatedProd = {
        name: "UpdatedProd",
        img: "http://localhost:3000/uploads/products/newimg.jpg"
      };
      productModel.findByIdAndUpdate.mockResolvedValue(updatedProd);

      const req = mockRequest({
        params: { idprod: "abc123" },
        body: { name: "UpdatedProd", img: "oldimg.jpg" },
        file: { filename: "newimg.jpg" }
      });
      const res = mockResponse();

      await productController.updateprod(req, res);

      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "abc123",
        {
          $set: {
            name: "UpdatedProd",
            img: "http://localhost:3000/uploads/products/newimg.jpg"
          }
        },
        { new: true }
      );

      expect(res.json).toHaveBeenCalledWith({ product: updatedProd });
    });

    it("404 si produit non trouvé lors de la mise à jour", async () => {
      productModel.findByIdAndUpdate.mockResolvedValue(null);

      const req = mockRequest({ params: { idprod: "abc123" }, body: {} });
      const res = mockResponse();

      await productController.updateprod(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Produit non trouvé" });
    });

    it("gestion erreur lors de la mise à jour", async () => {
      productModel.findByIdAndUpdate.mockRejectedValue(
        new Error("Update error")
      );

      const req = mockRequest({ params: { idprod: "abc123" }, body: {} });
      const res = mockResponse();

      await productController.updateprod(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Update error" });
    });
  });

  describe("deleteprod", () => {
    it("supprime un produit et confirme", async () => {
      productModel.findByIdAndDelete.mockResolvedValue({ _id: "abc123" });

      const req = mockRequest({ params: { idprod: "abc123" } });
      const res = mockResponse();

      await productController.deleteprod(req, res);

      expect(productModel.findByIdAndDelete).toHaveBeenCalledWith("abc123");
      expect(res.json).toHaveBeenCalledWith({
        msg: "Produit supprimé avec succès"
      });
    });

    it("404 si produit non trouvé lors de la suppression", async () => {
      productModel.findByIdAndDelete.mockResolvedValue(null);

      const req = mockRequest({ params: { idprod: "abc123" } });
      const res = mockResponse();

      await productController.deleteprod(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Produit non trouvé" });
    });

    it("gestion erreur lors de la suppression", async () => {
      productModel.findByIdAndDelete.mockRejectedValue(
        new Error("Delete error")
      );

      const req = mockRequest({ params: { idprod: "abc123" } });
      const res = mockResponse();

      await productController.deleteprod(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: "Delete error" });
    });
  });
});
