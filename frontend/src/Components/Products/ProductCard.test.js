import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import configureMockStore from "redux-mock-store";
import { deleteProduct } from "../../JS/action/prodAction";

// Configuration simplifiée du mock store sans middleware
const mockStore = configureMockStore();

describe("ProductCard Component", () => {
  const mockProduct = {
    _id: "1",
    name: "Produit Test",
    price: 99.99,
    qtes: 10,
    img: "http://localhost:4000/images/test.jpg"
  };

  const renderComponent = (product, userRole = null) => {
    const store = mockStore({
      auth: {
        currentUser: userRole ? { role: userRole } : null
      }
    });

    return render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard prd={product} />
        </MemoryRouter>
      </Provider>
    );
  };

  test("renders product information correctly", () => {
    renderComponent(mockProduct);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.price} DT`)).toBeInTheDocument();
    expect(
      screen.getByText(`En stock: ${mockProduct.qtes}`)
    ).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "http://localhost:7100/images/test.jpg"
    );
    expect(screen.getByText("Voir détails")).toBeInTheDocument();
  });

  test("shows out of stock badge when product is out of stock", () => {
    const outOfStockProduct = { ...mockProduct, qtes: 0 };
    renderComponent(outOfStockProduct);

    expect(screen.getByText("Épuisé")).toBeInTheDocument();
    expect(screen.getByText("Non disponible")).toBeInTheDocument();
  });

  test("does not show admin buttons for non-admin users", () => {
    renderComponent(mockProduct);

    expect(screen.queryByText("Modifier")).not.toBeInTheDocument();
    expect(screen.queryByText("Supprimer")).not.toBeInTheDocument();
  });

  test("shows admin buttons for admin users", () => {
    renderComponent(mockProduct, "admin");

    expect(screen.getByText("Modifier")).toBeInTheDocument();
    expect(screen.getByText("Supprimer")).toBeInTheDocument();
  });

  test("does not call deleteProduct when confirmation is canceled", () => {
    window.confirm = jest.fn(() => false);

    const store = mockStore({
      auth: {
        currentUser: { role: "admin" }
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProductCard prd={mockProduct} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Supprimer"));

    expect(window.confirm).toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});
