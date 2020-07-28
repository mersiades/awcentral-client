import React, { useState } from 'react';
import { Box, Header, Menu, BoxProps, Button, Grid, Tabs, Tab, grommet, ThemeContext } from 'grommet';
import styled from 'styled-components';
import { neutralColors, accentColors } from '../config/grommetConfig';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { AWCENTRAL_GUILD_ID } from '../services/discordService';
import { useGame } from '../contexts/gameContext';
import { deepMerge } from 'grommet/utils';

const SidePanel = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  background-color: pink;
`;

const MainContainer = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  height: calc(100vh - 89px);
`;

const Footer = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  border-top: 8px solid transparent;
  border-image-source: url(/images/black-line.png);
  border-image-slice: 25 15;
`;

const customDefaultButtonStyles = deepMerge(grommet, {
  button: {
    default: {
      color: {
        dark: 'white',
        light: 'black',
      },
      background: {
        color: {
          dark: neutralColors[0],
          light: neutralColors[0],
        },
        opacity: 100,
      },
      border: 'none',
    },
    hover: {
      border: 'none',
      backgroundColor: `${accentColors[0]}`,
      extend: 'font-weight: 500; font-size: 18px;',
    },
    extend: `
    font-family: 'Vtks good luck for you', sans-serif;
    font-size: 18px;
    line-height: 24px;
    color: #fff;
    &:hover {
      background-color: ${accentColors[0]};
      color: #fff;
    };
    &:focus {
      outline: 0;
      box-shadow: none;
      background-color: ${accentColors[0]};
    }
    `,
  },
});

const customTabStyles = deepMerge(grommet, {
  text: {
    medium: '36px',
  },
  tab: {
    extend: `
    font-size: 36px;
    font-family: 'Vtks good luck for you', sans-serif;
    `,
  },
  button: {
    extend: `
    &:focus {
      outline: 0;
      box-shadow: none;
    }
    `,
  },
});

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
        <ThemeContext.Extend value={customDefaultButtonStyles}>
          <Menu
            dropBackground="neutral-1"
            label="AW Central"
            items={[
              { label: 'Main menu', onClick: () => history.push('/menu') },
              { label: 'Log out', onClick: () => logOut() },
            ]}
          />
          {dummyData.players.map((player) => (
            <Button key={player.name} label={player.name} />
          ))}
          <Button label="Threat map" />
          <Button
            label="Discord channel"
            href={`https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.textChannelID}`}
            target="_blank"
          />
        </ThemeContext.Extend>
      </Header>
      <Grid
        fill
        rows={['full']}
        columns={showSidePanel ? ['1/4'] : ['full']}
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
            {splitPanes && (
              <Box gridArea="main-right" background="accent-3">
                <p onClick={() => setSplitPanes(false)}>right</p>
              </Box>
            )}
          </Grid>
        </MainContainer>
      </Grid>
      <ThemeContext.Extend value={customTabStyles}>
        <Footer direction="row" justify="between">
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
        </Footer>
      </ThemeContext.Extend>
    </>
  );
};

export default MCPage;
