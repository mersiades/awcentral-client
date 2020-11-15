import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Header,
  Menu,
  BoxProps,
  Button,
  Tabs,
  Tab,
  ThemeContext,
  Layer,
  Heading,
  Paragraph,
  Collapsible,
} from 'grommet';
import styled, { css } from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';

import GamePanel from './GamePanel';
import MovesPanel from './MovesPanel';
import { Footer, MainContainer, SidePanel } from './styledComponents';
import { useAuth } from '../contexts/authContext';
import { useDiscordUser } from '../contexts/discordUserContext';
import DELETE_GAME from '../mutations/deleteGame';
import USER_BY_DISCORD_ID from '../queries/userByDiscordId';
import GAME_BY_TEXT_CHANNEL_ID, { GameByTextChannelData, GameByTextChannelVars } from '../queries/gameByTextChannelId';
import ALL_MOVES, { AllMovesData } from '../queries/allMoves';
import { Roles, WebsocketRequests } from '../@types/enums';
import { customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';
import '../assets/styles/transitions.css';
import { useWebsocketContext } from '../contexts/websocketContext';
import { GameRequest } from '../@types';
import { AWCENTRAL_GUILD_ID } from '../config/discordConfig';

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

const MCPage = () => {
  const maxSidePanel = 3;
  const sidePanelWidth = 25;

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
  const [showDeleteGameDialog, setShowDeleteGameDialog] = useState(false);

  const history = useHistory();
  const { logOut } = useAuth();
  const { discordId } = useDiscordUser();
  const { stompClient } = useWebsocketContext();
  const { gameID: textChannelId } = useParams<{ gameID: string }>();
  const [deleteGame] = useMutation(DELETE_GAME);
  const { data: allMovesData } = useQuery<AllMovesData>(ALL_MOVES);

  const { data: gameData, loading: loadingGame } = useQuery<GameByTextChannelData, GameByTextChannelVars>(
    GAME_BY_TEXT_CHANNEL_ID,
    { variables: { textChannelId } }
  );

  const handleDeleteGame = () => {
    console.log('handleDeleteGame', handleDeleteGame);
    if (!!game?.voiceChannelId) {
      const destination = '/app/games';
      const deleteChannelsRequest: GameRequest = {
        type: WebsocketRequests.deleteChannels,
        textChannelId,
        voiceChannelId: game?.voiceChannelId,
      };
      const body = JSON.stringify(deleteChannelsRequest);
      stompClient?.publish({ destination, body });
    } else {
      console.warn('Unable to delete Discord channels');
    }
    deleteGame({ variables: { textChannelId }, refetchQueries: [{ query: USER_BY_DISCORD_ID, variables: { discordId } }] });
    history.push('/menu');
  };

  const game = gameData?.gameByTextChannelId;
  const allMoves = allMovesData?.allMoves;
  if (loadingGame || !game) {
    return <div> Loading </div>;
  }

  console.log('game', game);

  return (
    <>
      {showDeleteGameDialog && (
        <Layer onEsc={() => setShowDeleteGameDialog(false)} onClickOutside={() => setShowDeleteGameDialog(false)}>
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
          {game.gameRoles
            .filter((gameRole) => gameRole.role === Roles.player)
            .map((gameRole) =>
              gameRole.characters?.map((character) => <Button key={character.name} label={character.name} />)
            )}
          <Button label="Threat map" />
          <Button
            label="Discord channel"
            href={`https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.textChannelId}`}
            target="_blank"
          />
        </ThemeContext.Extend>
      </Header>
      <div>
        <Collapsible direction="horizontal" open={sidePanel < 3}>
          <SidePanel sidePanel={sidePanel} growWidth={sidePanelWidth}>
            {sidePanel === 0 && (
              <GamePanel closePanel={setSidePanel} setShowDeleteGameDialog={setShowDeleteGameDialog} game={game} />
            )}
            {sidePanel === 1 && !!allMoves && <MovesPanel closePanel={setSidePanel} allMoves={allMoves} />}
            {sidePanel === 2 && <p onClick={() => setSidePanel(3)}>MCMovesPanel</p>}
          </SidePanel>
        </Collapsible>
        <MainContainer sidePanel={sidePanel} maxPanels={maxSidePanel} shinkWidth={sidePanelWidth}>
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
            {allMoves && <Tab title="Moves" />}
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
