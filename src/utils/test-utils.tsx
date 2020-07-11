import React from "react";
import { Grommet } from "grommet";
import { render, RenderOptions } from "@testing-library/react";

const AllTheProviders = ({ children }: any) => {
  return <Grommet plain>{children}</Grommet>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
