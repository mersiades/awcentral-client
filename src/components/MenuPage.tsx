import React, { FC, useState } from 'react';
import { Button, Box, Image, Heading, FormField, TextInput, Text, Grid, BoxProps } from 'grommet';
import { Close } from 'grommet-icons';
import { useAuth } from '../contexts/authContext';
import styled from 'styled-components';
import '../assets/styles/transitions.css';
import CreateGameForm from './CreateGameForm';
import { useDiscordUser } from '../contexts/discordUserContext';
import { useQuery } from '@apollo/client';
import USER_BY_DISCORD_ID from '../queries/userByDiscordId';
import GamesList from './GamesList';

const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/cover-background.jpg)',
};

//
const ButtonsContainer = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
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
  // ---------------------------------- Accessing React context -------------------------------------------- //
  const { logOut } = useAuth();
  const { username, discordId } = useDiscordUser();

  // ------------------------------ Hooking in to Apollo graphql ----------------------------------------- //
  const { data: userData, loading } = useQuery(USER_BY_DISCORD_ID, { variables: { discordId }, skip: !discordId });
  !!userData && console.log('userData', userData);

  const handleLogout = () => {
    logOut();
  };

  // if (loading || !userData) {
  //   return <Box fill background={background} />
  // }

  return (
    <Box fill background={background}>
      <Text margin="medium" size="medium">
        {username && `Welcome, ${username}`}
      </Text>
        {buttonsContainer === 0 && (
          <ButtonsContainer animation={{ type: "slideUp", size: "large", duration: 750}}>
            <Box gap="small">
              {!!userData && userData.userByDiscordId.gameRoles.length > 0 && (
                <Button
                  label="RETURN TO GAME"
                  primary
                  size="large"
                  alignSelf="center"
                  fill
                  onClick={() => setButtonsContainer(1)}
                />
              )}
              <Button
                label="JOIN GAME"
                secondary
                size="large"
                alignSelf="center"
                fill
                onClick={() => setButtonsContainer(2)}
              />
              <Button
                label="CREATE GAME"
                secondary
                size="large"
                alignSelf="center"
                fill
                onClick={() => setButtonsContainer(3)}
              />
             <Button label="LOG OUT" size="large" alignSelf="center" fill onClick={() => handleLogout()} />
            </Box>
          </ButtonsContainer>
        )}
        {buttonsContainer === 1 && (
          <ButtonsContainer animation={{ type: "slideUp", size: "large", duration: 750}}>
            <Grid
              rows={['xsmall']}
              columns={['xxsmall', 'small']}
              justifyContent="between"
              align="center"
              areas={[
                { name: 'header-left', start: [0, 0], end: [0, 0] },
                { name: 'header-right', start: [1, 0], end: [1, 0] },
              ]}
            >
              <Box gridArea="header-left" align="start" alignContent="center">
                <Close color="accent-1" onClick={() => setButtonsContainer(0)} />
              </Box>
              <Box gridArea="header-right">
                <Heading level={1} margin={{ vertical: 'small' }} size="small" textAlign="end">
                  YOUR GAMES
                </Heading>
              </Box>
            </Grid>
            <GamesList gameRoles={userData.userByDiscordId.gameRoles} />
          </ButtonsContainer>
        )}
        {buttonsContainer === 2 && (
          <ButtonsContainer animation={{ type: "slideUp", size: "large", duration: 750}}>
            <Grid
              rows={['xsmall']}
              columns={['xxsmall', 'small']}
              justifyContent="between"
              align="center"
              areas={[
                { name: 'header-left', start: [0, 0], end: [0, 0] },
                { name: 'header-right', start: [1, 0], end: [1, 0] },
              ]}
            >
              <Box gridArea="header-left" align="start" alignContent="center">
                <Close color="accent-1" onClick={() => setButtonsContainer(0)} />
              </Box>
              <Box gridArea="header-right">
                <Heading level={1} margin={{ vertical: 'small' }} size="small" textAlign="end">
                  JOIN GAME
                </Heading>
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
        )}
        {buttonsContainer === 3 && (
          <ButtonsContainer animation={{ type: "slideUp", size: "large", duration: 750}}>
            <Grid
              rows={['xsmall']}
              columns={['xxsmall', 'small']}
              justifyContent="between"
              align="center"
              areas={[
                { name: 'header-left', start: [0, 0], end: [0, 0] },
                { name: 'header-right', start: [1, 0], end: [1, 0] },
              ]}
            >
              <Box gridArea="header-left" align="start" alignContent="center">
                <Close color="accent-1" onClick={() => setButtonsContainer(0)} />
              </Box>
              <Box gridArea="header-right">
                <Heading level={1} margin={{ vertical: 'small' }} size="small" textAlign="end">
                  CREATE GAME
                </Heading>
              </Box>
            </Grid>
            <CreateGameForm />
          </ButtonsContainer>
        )}
        {buttonsContainer === 3 && (
          <ButtonsContainer animation={{ type: "slideUp", size: "large", duration: 750}}>
            <Grid
              rows={['xsmall']}
              columns={['xxsmall', 'small']}
              justifyContent="between"
              align="center"
              areas={[
                { name: 'header-left', start: [0, 0], end: [0, 0] },
                { name: 'header-right', start: [1, 0], end: [1, 0] },
              ]}
            >
              <Box gridArea="header-left" align="start" alignContent="center">
                <Close color="accent-1" onClick={() => setButtonsContainer(0)} />
              </Box>
              <Box gridArea="header-right">
                <Heading level={1} margin={{ vertical: 'small' }} size="small" textAlign="end">
                  CREATE GAME
                </Heading>
              </Box>
            </Grid>
            <CreateGameForm />
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
