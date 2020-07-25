import React, { FC, useState } from 'react';
import { Button, Box, Image, Heading } from 'grommet';
import { useAuth } from '../contexts/auth';
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

const MenuPage: FC = () => {
  const [buttonsContainer, setButtonsContainer] = useState(0);
  const { logOut } = useAuth();

  const handleLogout = () => {
    logOut();
  };
  return (
    <Box fill background={background}>
      {buttonsContainer === 0 && (
        <ButtonsContainer>
          <Box gap="small">
            <Button label="RETURN TO GAME" primary size="large" alignSelf="center" fill />
            <Button
              label="JOIN GAME"
              secondary
              size="large"
              alignSelf="center"
              fill
              onClick={() => setButtonsContainer(1)}
            />
            <Button label="CREATE GAME" secondary size="large" alignSelf="center" fill />
            <Button label="LOG OUT" size="large" alignSelf="center" fill onClick={() => handleLogout()} />
          </Box>
        </ButtonsContainer>
      )}
      {buttonsContainer === 1 && (
        <ButtonsContainer>
          <Box gap="small">
            <Heading level={1} margin={{ vertical: 'small' }} size="small" textAlign="start">
              JOIN GAME
            </Heading>
            <Button label="SUBMIT" primary size="large" alignSelf="center" fill />
          </Box>
        </ButtonsContainer>
      )}
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

export default MenuPage;
