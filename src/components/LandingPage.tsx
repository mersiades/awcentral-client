import React from "react";
import { Button, Box } from "grommet";
import styled from "styled-components";

const background = {
  color: "black",
  dark: true,
  size: "contain",
  image: "url(/images/cover-background.jpg)",
};

const ButtonsContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 295px;
  left: calc((100vw / 2) - 368px);
  padding-bottom: 16px;
`;

const LandingPage = () => {
  return (
    <Box fill background={background}>
      <ButtonsContainer>
        <Box gap="medium">
          <Button label="LOG IN" primary size="large" alignSelf="center" fill />
          <Button
            label="SIGN UP"
            secondary
            alignSelf="center"
            fill
            size="large"
          />
        </Box>
      </ButtonsContainer>
    </Box>
  );
};

export default LandingPage;
