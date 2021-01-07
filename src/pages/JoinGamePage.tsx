import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box, Image, Heading, Grid } from 'grommet';

import InvitationsList from '../components/InvitationsList';
import GAMES_FOR_INVITEE, { GamesForInviteeData, GamesForInviteeVars } from '../queries/gamesForInvitee';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { HeadingWS, StyledClose } from '../config/grommetConfig';
import '../assets/styles/transitions.css';
import Spinner from '../components/Spinner';
import { useFonts } from '../contexts/fontContext';

const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/cover-background.jpg)',
};

const MenuPage: FC = () => {
  // ---------------------------------- Accessing React context -------------------------------------------- //
  const { username, email } = useKeycloakUser();
  const { vtksReady } = useFonts();

  // -------------------------------- Hooking in to Apollo graphql ----------------------------------------- //
  const { data } = useQuery<GamesForInviteeData, GamesForInviteeVars>(GAMES_FOR_INVITEE, {
    skip: !email,
    // @ts-ignore
    variables: { email },
  });

  const games = data?.gamesForInvitee;

  // -------------------------------- Hooking in to react-router ----------------------------------------- //
  const history = useHistory();

  // ------------------------------------- Render component ---------------------------------------------- //
  return (
    <Box data-testid="join-game-page" fill background={background}>
      {!games && (
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
          <Heading level="4">{username && `Welcome, ${username}`}</Heading>
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
              { name: 'gamesContainer', start: [0, 0], end: [0, 0] },
              { name: 'spacer', start: [1, 0], end: [1, 0] },
              { name: 'titleContainer', start: [2, 0], end: [2, 0] },
            ]}
          >
            {!!games ? (
              <Box gridArea="gamesContainer" alignSelf="end" gap="small" style={{ minHeight: '300px' }}>
                <Box animation={{ type: 'slideUp', size: 'large', duration: 750 }} gap="12px">
                  <Box direction="row" align="center" justify="between">
                    <Box align="start" alignContent="center">
                      <StyledClose color="accent-1" onClick={() => history.push('/')} cursor="pointer" />
                    </Box>
                    <HeadingWS vtksReady={vtksReady} level={1} margin={{ vertical: 'small' }} size="small" textAlign="end">
                      YOUR INVITATIONS
                    </HeadingWS>
                  </Box>
                  <InvitationsList games={games} />
                </Box>
              </Box>
            ) : null}
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
