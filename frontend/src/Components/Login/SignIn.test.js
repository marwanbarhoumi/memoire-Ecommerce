import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import SignIn from "./SignIn";

// ➕ Reducer de test minimal
const reducer = (state = { auth: { Alert: null } }, action) => state;
const store = createStore(reducer);

describe("SignIn Component", () => {
  it("renders without crashing", () => {
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router history={history}>
          <SignIn />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
  });

  it("updates email and password fields", () => {
    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router history={history}>
          <SignIn />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("submits form", () => {
    const history = createMemoryHistory();
    const mockStore = createStore(() => ({
      auth: { Alert: null },
    }));
    const mockDispatch = jest.fn();

    jest.spyOn(React, "useState").mockImplementationOnce(() => ["test@example.com", jest.fn()])
                                  .mockImplementationOnce(() => ["password123", jest.fn()]);
    jest.spyOn(React, "useDispatch").mockReturnValue(mockDispatch);

    render(
      <Provider store={mockStore}>
        <Router history={history}>
          <SignIn />
        </Router>
      </Provider>
    );

    const form = screen.getByRole("form", { hidden: true }) || screen.getByText(/Se connecter/i).closest("form");

    fireEvent.submit(form);

    expect(mockDispatch).toHaveBeenCalled();
  });
});
