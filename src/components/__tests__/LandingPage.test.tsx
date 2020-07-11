import React from "react";
import { render } from "../../utils/test-utils";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import LandingPage from "../LandingPage";

describe("Rendering Landing Page", () => {
  test("should render LandingPage in initial state", () => {
    const container = render(<LandingPage />);
    const loginButton = screen.getByText("LOG IN");
    const signUpButton = screen.getByText("SIGN UP");
    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});
