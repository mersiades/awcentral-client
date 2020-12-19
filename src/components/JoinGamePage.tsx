import React, { FC } from 'react';
import { Button, Box, Image, Heading, Grid } from 'grommet';
import { Close } from 'grommet-icons';
import '../assets/styles/transitions.css';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { useQuery } from '@apollo/client';
// import GamesList from './GamesList';
import { useHistory } from 'react-router-dom';
import GAMES_FOR_INVITEE, { GamesForInviteeData, GamesForInviteeVars } from '../queries/gamesForInvitee';
import InvitationsList from './InvitationsList';

const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/cover-background.jpg)',
};

const MenuPage: FC = () => {
  // ---------------------------------- Accessing React context -------------------------------------------- //
  const { username, email } = useKeycloakUser();

  // -------------------------------- Hooking in to Apollo graphql ----------------------------------------- //
  const { data, loading } = useQuery<GamesForInviteeData, GamesForInviteeVars>(GAMES_FOR_INVITEE, {
    skip: !email,
    // @ts-ignore
    variables: { email },
  });

  const games = data?.gamesForInvitee;

  // -------------------------------- Hooking in to react-router ----------------------------------------- //
  const history = useHistory();

  // ------------------------------------- Render component ---------------------------------------------- //
  if (loading || !games) {
    return <Box fill background={background} />;
  }

  console.log('games', games);

  return (
    <Box fill background={background}>
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
            <Box gridArea="gamesContainer" alignSelf="end">
              <Box animation={{ type: 'slideUp', size: 'large', duration: 750 }}>
                <Box gap="small">
                  <Box animation={{ type: 'slideUp', size: 'large', duration: 750 }}>
                    <Grid
                      fill
                      rows={['xsmall']}
                      columns={['10%', '90%']}
                      justifyContent="between"
                      align="center"
                      areas={[
                        { name: 'header-left', start: [0, 0], end: [0, 0] },
                        { name: 'header-right', start: [1, 0], end: [1, 0] },
                      ]}
                    >
                      <Box gridArea="header-left" align="start" alignContent="center">
                        <Close color="accent-1" onClick={() => history.push('/')} cursor="pointer" />
                      </Box>
                      <Box gridArea="header-right">
                        <Heading level={1} margin={{ vertical: 'small' }} size="small" textAlign="end">
                          YOUR INVITATIONS
                        </Heading>
                      </Box>
                    </Grid>
                    <InvitationsList games={games} />
                  </Box>
                  <Button label="MAIN MENU" size="large" alignSelf="center" fill onClick={() => history.push('/menu')} />
                </Box>
              </Box>
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
