import React from "react";
import { Button, Box, Image } from "grommet";
import styled from "styled-components";

const background = {
  color: "black",
  dark: true,
  size: "contain",
  image: "url(/images/cover-background.jpg)",
};

const ButtonsContainer = styled.div`
  position: absolute;
  bottom: calc(4vh + 2px);
  width: 25vw;
  max-width: 300px;
  left: calc((100vw / 2) - 368px);
`;

const TitleContainer = styled.div`
  position: absolute;
  bottom: 4vh;
  width: 25vw;
  max-width: 300px;
  right: calc((100vw / 2) - 368px);
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
      <TitleContainer>
        <Box>
          <Image fit="contain" fill={true} src="images/cover-title.png" />
        </Box>
      </TitleContainer>
    </Box>
  );
};

export default LandingPage;
