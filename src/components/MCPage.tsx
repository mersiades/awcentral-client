import React, { useState } from 'react';
import { Box, Header, Menu, BoxProps, MenuProps, Button, ButtonProps, Grid, Tabs, Tab } from 'grommet';
import styled from 'styled-components';
import { neutralColors, accentColors } from '../config/grommetConfig';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { AWCENTRAL_GUILD_ID } from '../services/discordService';
import { useGame } from '../contexts/gameContext';

const NavMenu = styled(Menu as React.FC<MenuProps & JSX.IntrinsicElements['div']>)`
  background-color: ${neutralColors[0]};
  color: white;
  border: none;
  &:hover {
    border: none;
    font-weight: 500;
    background-color: ${accentColors[0]};
  }
`;

const NavButton = styled(Button as React.FC<ButtonProps & JSX.IntrinsicElements['div']>)`
  background-color: ${neutralColors[0]};
  color: white;
  border: none;
  font-size: 18px;
  line-height: 24px;
  &:hover {
    border: none;
    font-weight: 500;
    background-color: ${accentColors[0]};
    font-size: 18px;
    line-height: 24px;
  }
`;

const SidePanel = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  background-color: pink;
`;

const MainContainer = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  height: calc(100vh - 60px);
`;

const dummyData = {
  players: [{ name: 'Abe' }, { name: 'Snow' }, { name: 'Joyette' }, { name: 'Hammer' }],
};

const MCPage = () => {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [splitPanes, setSplitPanes] = useState(false);
  const history = useHistory();
  const { logOut } = useAuth();
  const { game } = useGame();
  return (
    <>
      <Header background="neutral-1">
        <NavMenu
          dropBackground="accent-1"
          label="AW Central"
          items={[
            { label: 'Main menu', onClick: () => history.push('/menu') },
            { label: 'Log out', onClick: () => logOut() },
          ]}
        />
        {dummyData.players.map((player) => (
          <NavButton key={player.name} label={player.name} />
        ))}
        <NavButton label="Threat map" />
        <NavButton
          label="Discord channel"
          href={`https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.textChannelID}`}
          target="_blank"
        />
      </Header>
      <Grid
        fill
        rows={['full']}
        columns={showSidePanel ? ['1/3'] : ['full']}
        areas={
          showSidePanel
            ? [
                { name: 'side-panel', start: [0, 0], end: [0, 0] },
                { name: 'main', start: [1, 0], end: [2, 0] },
              ]
            : [{ name: 'main', start: [0, 0], end: [0, 0] }]
        }
      >
        {showSidePanel && (
          <SidePanel gridArea="side-panel">
            <p onClick={() => setShowSidePanel(false)}>Side Panel</p>
          </SidePanel>
        )}
        <MainContainer gridArea="main">
          <Grid
            fill
            rows={['full']}
            columns={splitPanes ? ['1/2'] : ['full']}
            areas={
              splitPanes
                ? [
                    { name: 'main-center', start: [0, 0], end: [0, 0] },
                    { name: 'main-right', start: [1, 0], end: [1, 0] },
                  ]
                : [{ name: 'main-center', start: [0, 0], end: [0, 0] }]
            }
          >
            <Box gridArea="main-center">
              <p>center</p>
            </Box>
            <Box gridArea="main-right" background="accent-3">
              <p onClick={() => setSplitPanes(false)}>right</p>
            </Box>
          </Grid>
        </MainContainer>
      </Grid>
      <Box direction="row" justify="between">
        <Tabs
          onActive={(tab) => {
            console.log('clicked', tab);
            setShowSidePanel(true);
          }}
        >
          <Tab title="Game" />
          <Tab title="Moves" />
          <Tab title="MC Moves" />
        </Tabs>
        <Tabs
          onActive={(tab) => {
            console.log('clicked', tab);
            setSplitPanes(true);
          }}
        >
          <Tab title="Threats" />
          <Tab title="NPCs" />
        </Tabs>
      </Box>
    </>
  );
};

export default MCPage;
