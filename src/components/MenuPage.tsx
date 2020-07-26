import React, { FC, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Button, Box, Image, Heading, FormField, TextInput, Text, Grid } from 'grommet';
import { Close } from 'grommet-icons';
import { useAuth } from '../contexts/auth';
import styled from 'styled-components';
import '../assets/styles/transitions.css';
import { useHistory } from 'react-router-dom';

const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/cover-background.jpg)',
};

//
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

  const history = useHistory();

  const handleLogout = () => {
    logOut();
  };
  return (
    <Box fill background={background}>
      <TransitionGroup>
        {buttonsContainer === 0 && (
          <CSSTransition in={buttonsContainer === 0} timeout={1000} classNames="buttons-container">
            <div>
              <ButtonsContainer>
                <Box gap="small">
                  <Button
                    label="RETURN TO GAME"
                    primary
                    size="large"
                    alignSelf="center"
                    fill
                    onClick={() => history.push('/game')}
                  />
                  <Button
                    label="JOIN GAME"
                    secondary
                    size="large"
                    alignSelf="center"
                    fill
                    onClick={() => setButtonsContainer(1)}
                  />
                  <Button
                    label="CREATE GAME"
                    secondary
                    size="large"
                    alignSelf="center"
                    fill
                    onClick={() => setButtonsContainer(2)}
                  />
                  <Button label="LOG OUT" size="large" alignSelf="center" fill onClick={() => handleLogout()} />
                </Box>
              </ButtonsContainer>
            </div>
          </CSSTransition>
        )}
        {buttonsContainer === 1 && (
          <CSSTransition in={buttonsContainer === 1} timeout={1000} classNames="buttons-container">
            <div>
              <ButtonsContainer>
                <Grid
                  // fill
                  rows={['xsmall']}
                  columns={['small', 'xxsmall']}
                  justifyContent="between"
                  align="center"
                  areas={[
                    { name: 'header-left', start: [0, 0], end: [0, 0] },
                    { name: 'header-right', start: [1, 0], end: [1, 0] },
                  ]}
                >
                  <Box gridArea="header-left">
                    <Heading level={1} margin={{ vertical: 'small' }} size="small" textAlign="start">
                      JOIN GAME
                    </Heading>
                  </Box>
                  <Box gridArea="header-right" align="end" alignContent="center">
                    <Close color="accent-1" onClick={() => setButtonsContainer(0)} />
                  </Box>
                </Grid>
                <Box gap="small">
                  <FormField label="Game code">
                    <TextInput placeholder="Enter code" />
                  </FormField>
                  <Text color="accent-1" margin={{ top: 'xsmall' }}>
                    Don't have a game code? Ask your game's MC for it
                  </Text>
                  <Button label="SUBMIT" primary size="large" alignSelf="center" fill />
                </Box>
              </ButtonsContainer>
            </div>
          </CSSTransition>
        )}
        {buttonsContainer === 2 && (
          <CSSTransition in={buttonsContainer === 2} timeout={1000} classNames="buttons-container">
            <div>
              <ButtonsContainer>
                <Grid
                  rows={['xsmall']}
                  columns={['small', 'xxsmall']}
                  justifyContent="between"
                  align="center"
                  areas={[
                    { name: 'header-left', start: [0, 0], end: [0, 0] },
                    { name: 'header-right', start: [1, 0], end: [1, 0] },
                  ]}
                >
                  <Box gridArea="header-left">
                    <Heading level={1} margin={{ vertical: 'small' }} size="small" textAlign="start">
                      CREATE GAME
                    </Heading>
                  </Box>
                  <Box gridArea="header-right" align="end" alignContent="center">
                    <Close color="accent-1" onClick={() => setButtonsContainer(0)} />
                  </Box>
                </Grid>
                <Box gap="small">
                  <FormField label="Game name">
                    <TextInput placeholder="Enter name" />
                  </FormField>
                  <Text color="accent-1" margin={{ top: 'xsmall' }}>
                    Create a game with you as the MC. Then invite your players
                  </Text>
                  <Button label="SUBMIT" primary size="large" alignSelf="center" fill />
                </Box>
              </ButtonsContainer>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
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
