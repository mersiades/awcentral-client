import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button, Box, Image } from 'grommet';
import styled from 'styled-components';

const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/cover-background.jpg)',
};

const ButtonsContainer = styled.div`
  position: absolute;
  bottom: calc(4vh + 2px);
  min-width: 172px;
  width: 25vw;
  max-width: 300px;
  left: 15vw;
`;

const TitleContainer = styled.div`
  position: absolute;
  bottom: 4vh;
  min-width: 172px;
  width: 25vw;
  max-width: 300px;
  right: 15vw;
`;

const LandingPage = () => {
  // --------------------------------------- Hooking into contexts ---------------------------------------------- //
  const { keycloak } = useKeycloak();

  // ----------------------------------------- Render component  ------------------------------------------------ //
  return (
    <Box fill background={background}>
      <ButtonsContainer>
        <Box gap="small">
          <Button label="LOG IN" primary size="large" alignSelf="center" fill onClick={() => keycloak.login()} />
          <Button label="REGISTER" secondary size="large" alignSelf="center" fill onClick={() => keycloak.register()} />
        </Box>
      </ButtonsContainer>
      <TitleContainer>
        <Box>
          <Image
            fit="contain"
            fill={true}
            src="images/cover-title.png"
            alt="D. Vincent Baker & Meguey Baker Apocalypse World"
          />
        </Box>
      </TitleContainer>
    </Box>
  );
};

export default LandingPage;
