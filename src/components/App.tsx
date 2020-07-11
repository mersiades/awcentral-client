import React, { FC } from "react";
import { Grommet } from "grommet";

import { theme } from "../config/grommetConfig";
import LandingPage from "./LandingPage";

const App: FC = () => {
  return (
    <Grommet theme={theme}>
      <LandingPage />
    </Grommet>
  );
};

export default App;
