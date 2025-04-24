import { render, screen, fireEvent } from "@testing-library/react";
import SignIn from "./SignIn"; // Remplace par ton chemin réel
import { MemoryRouter, useNavigate } from "react-router-dom";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn()
}));

describe("SignIn Component", () => {
  it("should render SignIn component and handle submit", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    // Vérifie la présence des champs
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    // Simule un événement de soumission du formulaire
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@mail.com" }
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" }
    });
    fireEvent.click(screen.getByText("Sign In"));

    // Vérifie que `useNavigate` a été appelé après la soumission
    expect(useNavigate).toHaveBeenCalled();
  });
});
