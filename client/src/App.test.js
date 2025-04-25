import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const mockStore = configureStore([]);
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock("./JS/action/authActions", () => ({
  getUser: () => ({ type: "MOCK_GET_USER" }),
}));

describe("App Component", () => {
  it("should render Home page on / route", () => {
    const store = mockStore({ auth: { currentUser: null } });
    window.history.pushState({}, "Home page", "/");

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });
});
