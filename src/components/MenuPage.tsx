import React, { FC, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box, Image, Grid } from 'grommet';

import CreateGameForm from './CreateGameForm';
import GamesList from './GamesList';
import Spinner from './Spinner';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import GAMEROLES_BY_USER_ID, { GameRolesByUserIdData, GameRolesByUserIdVars } from '../queries/gameRolesByUserId';
import { background, ButtonWS, HeadingWS, StyledClose } from '../config/grommetConfig';
import '../assets/styles/transitions.css';
import { useFonts } from '../contexts/fontContext';

const MenuPage: FC = () => {
  // ---------------------------------- Accessing React context -------------------------------------------- //
  const [buttonsContainer, setButtonsContainer] = useState(0);

  // ---------------------------------- Accessing React context -------------------------------------------- //
  const { username, id: keycloakId } = useKeycloakUser();
  const { vtksReady } = useFonts();

  // ---------------------------------- Hooking in to Keycloak  -------------------------------------------- //
  const { keycloak } = useKeycloak();

  // -------------------------------- Hooking in to Apollo graphql ----------------------------------------- //
  const { data } = useQuery<GameRolesByUserIdData, GameRolesByUserIdVars>(GAMEROLES_BY_USER_ID, {
    // @ts-ignore
    variables: { id: keycloakId },
    skip: !keycloakId,
  });

  const gameRoles = data?.gameRolesByUserId;

  // -------------------------------- Hooking in to react-router ----------------------------------------- //
  const history = useHistory();

  // ------------------------------------- Render component ---------------------------------------------- //

  const renderMenuButtons = () => {
    if (!gameRoles) {
      return null;
    } else {
      return (
        <Box animation={{ type: 'slideUp', size: 'large', duration: 750 }}>
          <Box gap="small">
            {gameRoles.length > 0 && (
              <ButtonWS
                label="RETURN TO GAME"
                primary
                size="large"
                alignSelf="center"
                fill
                onClick={() => setButtonsContainer(1)}
              />
            )}
            <ButtonWS
              label="JOIN GAME"
              secondary
              size="large"
              alignSelf="center"
              fill
              onClick={() => history.push('/join-game')}
            />
            <ButtonWS
              label="CREATE GAME"
              secondary
              size="large"
              alignSelf="center"
              fill
              onClick={() => setButtonsContainer(2)}
            />
            <ButtonWS
              label="LOG OUT"
              size="large"
              alignSelf="center"
              fill
              onClick={() => {
                history.push('/');
                keycloak.logout();
              }}
            />
          </Box>
        </Box>
      );
    }
  };

  console.log('gameRoles', gameRoles);

  return (
    <Box fill background={background}>
      {!gameRoles && (
        <div style={{ position: 'absolute', top: 'calc(50vh - 12px)', left: 'calc(50vw - 12px)' }}>
          <Spinner />
        </div>
      )}
      <Grid
        rows={['49%', '49%', '2%']}
        columns={['18%', 'auto', '18%']}
        gap={{ column: 'xsmall', row: 'none' }}
        fill
        responsive
        areas={[
          { name: 'leftMargin', start: [0, 0], end: [0, 2] },
          { name: 'centerTop', start: [1, 0], end: [1, 0] },
          { name: 'centerBottom', start: [1, 1], end: [1, 1] },
          { name: 'centerFooter', start: [1, 2], end: [1, 2] },
          { name: 'rightMargin', start: [2, 0], end: [2, 2] },
        ]}
      >
        <Box gridArea="leftMargin" />
        <Box gridArea="centerTop">
          <HeadingWS level="4">{username && `Welcome, ${username}`}</HeadingWS>
        </Box>
        <Box gridArea="centerBottom">
          <Grid
            rows={['full']}
            columns={[
              ['250px', '450px'],
              ['5%', 'auto'],
              ['250px', '450px'],
            ]}
            fill
            justifyContent="between"
            areas={[
              { name: 'buttonsContainer', start: [0, 0], end: [0, 0] },
              { name: 'spacer', start: [1, 0], end: [1, 0] },
              { name: 'titleContainer', start: [2, 0], end: [2, 0] },
            ]}
          >
            <Box gridArea="buttonsContainer" alignSelf="end">
              {buttonsContainer === 0 && renderMenuButtons()}
              {buttonsContainer === 1 && (
                <Box animation={{ type: 'slideUp', size: 'large', duration: 750 }} style={{ minHeight: '300px' }}>
                  <Box direction="row" align="center" justify="between">
                    <Box align="start" alignContent="center">
                      <StyledClose color="accent-1" onClick={() => setButtonsContainer(0)} />
                    </Box>
                    <HeadingWS vtksReady={vtksReady} level={1} margin={{ vertical: 'small' }} size="small" textAlign="end">
                      YOUR GAMES
                    </HeadingWS>
                  </Box>
                  {!!gameRoles ? <GamesList gameRoles={gameRoles} /> : null}
                </Box>
              )}
              {buttonsContainer === 2 && (
                <Box animation={{ type: 'slideUp', size: 'large', duration: 750 }} style={{ minHeight: '300px' }}>
                  <Box direction="row" align="center" justify="between">
                    <Box align="start" alignContent="center">
                      <StyledClose color="accent-1" onClick={() => setButtonsContainer(0)} cursor="pointer" />
                    </Box>
                    <HeadingWS vtksReady={vtksReady} level={1} margin={{ vertical: 'small' }} size="small" textAlign="end">
                      CREATE GAME
                    </HeadingWS>
                  </Box>
                  <CreateGameForm />
                </Box>
              )}
            </Box>
            <Box gridArea="spacer" alignSelf="end" />
            <Box gridArea="titleContainer" alignSelf="end">
              <Box>
                <Image
                  fit="contain"
                  fill={true}
                  src="images/cover-title.png"
                  alt="D. Vincent Baker & Meguey Baker Apocalypse World"
                />
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box gridArea="rightMargin" />
      </Grid>
    </Box>
  );
};

export default MenuPage;
