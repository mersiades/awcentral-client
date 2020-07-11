import React, { FC } from "react";
import { Grommet, Box } from "grommet";

import { theme } from "../config/grommetConfig";
import LandingPage from "./LandingPage";

const App: FC = () => {
  return (
    <Grommet theme={theme} full>
      <Box fill>
        <LandingPage />
      </Box>
    </Grommet>
  );
};

export default App;
