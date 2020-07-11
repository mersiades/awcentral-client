import React from "react";
import { render } from "../../utils/test-utils";
import { screen } from "@testing-library/react";
import App from "../App";

test("renders nothing worth testing yet", () => {
  const { getByText } = render(<App />);
});
