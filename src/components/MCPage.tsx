import React, { useState } from 'react';
import { Box, Header, Menu, BoxProps, Button, Tabs, Tab, grommet, ThemeContext, Layer, Heading, Paragraph } from 'grommet';
import styled, { css } from 'styled-components';
import { neutralColors, accentColors } from '../config/grommetConfig';
import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { AWCENTRAL_GUILD_ID } from '../services/discordService';
import { deepMerge } from 'grommet/utils';
import '../assets/styles/transitions.css';
import GamePanel from './GamePanel';
import { useMutation, useQuery } from '@apollo/client';
import GAME_BY_TEXT_CHANNEL_ID from '../queries/gameByTextChannelId';
import { Game } from '../@types';
import { Roles } from '../@types/enums';
import DELETE_GAME from '../mutations/deleteGame';
import USER_BY_DISCORD_ID from '../queries/userByDiscordId';
import { useDiscordUser } from '../contexts/discordUserContext';

interface SidePanelProps {
  readonly sidePanel: number;
}

const SidePanel = styled(Box as React.FC<SidePanelProps & BoxProps & JSX.IntrinsicElements['div']>)(({ sidePanel }) => {
  return css`
    border-right: 1px solid transparent;
    border-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black, rgba(0, 0, 0, 0)) 1 100%;
    position: absolute;
    height: calc(100vh - 95px);
    width: 25vw;
    transform: translateX(-25vw);
    transition: transform 200ms ease-in-out;
    ${sidePanel !== 3 &&
    css`
      transform: translateX(0vw);
    `};
  `;
});

interface MainContainerProps {
  readonly sidePanel: number;
}

const MainContainer = styled(Box as React.FC<MainContainerProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ sidePanel }) => {
    return css`
      height: calc(100vh - 95px);
      width: 100vw;
      transition: width 200ms ease-in-out, transform 200ms ease-in-out;
      ${sidePanel !== 3 &&
      css`
        transform: translateX(25vw);
        width: 75vw;
      `};
    `;
  }
);

interface LeftMainProps {
  readonly rightPanel: number;
}

const LeftMainContainer = styled(Box as React.FC<LeftMainProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ rightPanel }) => {
    return css`
      height: calc(100vh - 95px);
      width: 100%;
      transition: width 200ms ease-in-out;
      ${rightPanel !== 2 &&
      css`
        width: 50%;
      `};
    `;
  }
);

interface RightMainProps {
  readonly rightPanel: number;
}
const RightMainContainer = styled(Box as React.FC<RightMainProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ rightPanel }) => {
    return css`
      border-left: 1px solid transparent;
      border-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black, rgba(0, 0, 0, 0)) 1 100%;
      position: absolute;
      height: calc(100vh - 95px);
      opacity: 0;
      transform: translateX(200%);
      transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
      ${rightPanel !== 2 &&
      css`
        transform: translateX(100%);
        width: 50%;
        opacity: 1;
      `};
    `;
  }
);

const Footer = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  border-top: 6px solid transparent;
  border-image-source: url(/images/black-line-short.png);
  border-image-slice: 17 0;
  border-image-repeat: round;
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

// const dummyData = {
//   players: [{ name: 'Abe' }, { name: 'Snow' }, { name: 'Joyette' }, { name: 'Hammer' }],
// };

interface GameData {
  gameByTextChannelId: Game
}

interface GameVars {
  textChannelId: string
}

const MCPage = () => {
  /**
   * Number that indicates what should be shown in the right panel
   * 0 - ThreatsPanel
   * 1 - NpcPanel
   * 2 - None, right panel is closed
   */
  const [rightPanel, setRightPanel] = useState<number>(2);

  /**
   * Number that indicates what should be shown in the side panel
   * 0 - GamePanel
   * 1 - MovesPanel
   * 2 - MCMovesPanel
   * 3 - None, side panel is closed
   */
  const [sidePanel, setSidePanel] = useState<number>(3);
  const [showDeleteGameDialog, setShowDeleteGameDialog] = useState(false)

  const history = useHistory();
  const { logOut } = useAuth();
  const { discordId } = useDiscordUser()
  const { gameID: textChannelId} = useParams<{ gameID: string}>()
  const [ deleteGame ] = useMutation(DELETE_GAME)

  const { data, loading} = useQuery<GameData, GameVars>(GAME_BY_TEXT_CHANNEL_ID, {variables: {textChannelId}})
  
  const handleDeleteGame = () => {
    deleteGame({ variables: { textChannelId }, refetchQueries: [{ query: USER_BY_DISCORD_ID, variables: { discordId  }}]})
    history.push('/menu')
  }

  // useEffect(() => {
  //   const fetchChannel = async () => {
  //     if (!!textChannelId) {
  //       try {
  //         const channel = await getTextChannel(textChannelId)
  //         console.log('channel', channel)

  //       } catch(e) {
  //         console.log('e', e)
  //       }
  //     }
  //   }
   
  //   fetchChannel()
    
  // }, [textChannelId])

  const game = data?.gameByTextChannelId
  if (loading || !game) {
    return <div> Loading </div>
  }

  console.log('game', game)
  return (
    <>
      {showDeleteGameDialog && (
        <Layer
          onEsc={() => setShowDeleteGameDialog(false)}
          onClickOutside={() => setShowDeleteGameDialog(false)}
        >
          <Box gap="24px" pad="24px">
            <Heading level={3}>Delete game?</Heading>
            <Paragraph>{`Are you sure you want to delete ${game.name}? This can't be undone.`}</Paragraph>
            <Box direction="row" align="end" justify="end" gap="6px">
            <Button label="CANCEL" secondary size="large" onClick={() => setShowDeleteGameDialog(false)} />
              <Button label="DELETE" primary size="large" onClick={() => handleDeleteGame()} />
              </Box>
          </Box>
        </Layer>
      )}
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
          { game.gameRoles.filter((gameRole) => gameRole.role === Roles.player)
          .map((gameRole) => gameRole.characters?.map((character) => (<Button key={character.name} label={character.name} />)))
          }
          <Button label="Threat map" />
          <Button
            label="Discord channel"
            href={`https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.textChannelId}`}
            target="_blank"
          />
        </ThemeContext.Extend>
      </Header>
      <div>
        <SidePanel sidePanel={sidePanel}>
          {sidePanel === 0 && <GamePanel closePanel={setSidePanel} setShowDeleteGameDialog={setShowDeleteGameDialog} game={game}/>}
          {sidePanel === 1 && <p onClick={() => setSidePanel(3)}>MovesPanel</p>}
          {sidePanel === 2 && <p onClick={() => setSidePanel(3)}>MCMovesPanel</p>}
        </SidePanel>
        <MainContainer sidePanel={sidePanel}>
          <LeftMainContainer rightPanel={rightPanel}>
            <p>Centre Centre Centre Centre Centre Centre Centre Centre Centre Centre Centre Centre Centre</p>
          </LeftMainContainer>
          <RightMainContainer rightPanel={rightPanel}>
            {rightPanel === 0 && <p>Threats</p>}
            {rightPanel === 1 && <p>NPCs</p>}
          </RightMainContainer>
        </MainContainer>
      </div>
      <ThemeContext.Extend value={customTabStyles}>
        <Footer direction="row" justify="between">
          <Tabs
            activeIndex={sidePanel}
            onActive={(tab) => {
              console.log('clicked', tab);
              tab === sidePanel ? setSidePanel(3) : setSidePanel(tab);
            }}
          >
            <Tab title="Game" />
            <Tab title="Moves" />
            <Tab title="MC Moves" />
          </Tabs>
          <Tabs
            activeIndex={rightPanel}
            onActive={(tab) => {
              console.log('clicked', tab);
              tab === rightPanel ? setRightPanel(2) : setRightPanel(tab);
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
