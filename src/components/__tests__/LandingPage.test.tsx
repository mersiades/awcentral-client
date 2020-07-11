import React from "react";
import { render } from "../../utils/test-utils";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import LandingPage from "../LandingPage";

describe("Rendering Landing Page", () => {
  test("should render LandingPage in initial state", () => {
    const titleText = "Landing Page";
    const container = render(<LandingPage />);
    const element = screen.getByText(titleText);
    expect(element).toBeInTheDocument();
  });
});
