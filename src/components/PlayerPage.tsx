import { useQuery } from '@apollo/client';
import { Button, Collapsible, Header, Menu, Tab, Tabs, ThemeContext } from 'grommet';
import React, { FC, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Game, Move } from '../@types';
import { customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';
import { useAuth } from '../contexts/authContext';
import ALL_MOVES from '../queries/allMoves';
import GAME_BY_TEXT_CHANNEL_ID from '../queries/gameByTextChannelId';
import { AWCENTRAL_GUILD_ID } from '../services/discordService';
import MovesPanel from './MovesPanel';
import { Footer, MainContainer, SidePanel } from './styledComponents';

interface GameData {
  gameByTextChannelId: Game
}

interface GameVars {
  textChannelId: string
}

interface AllMovesData {
  allMoves: Move[]
}

const PlayerPage: FC = () => {
  const maxSidePanel = 2
  const sidePanelWidth = 34
  /**
   * Number that indicates what should be shown in the side panel
   * 0 - CharacterPanel
   * 1 - MovesPanel
   * 2 - None, side panel is closed
   */
  const [sidePanel, setSidePanel] = useState<number>(maxSidePanel);
  
  const history = useHistory();
  const { logOut } = useAuth();
  const { gameID: textChannelId} = useParams<{ gameID: string}>()
  const { data: gameData, loading: loadingGame} = useQuery<GameData, GameVars>(GAME_BY_TEXT_CHANNEL_ID, {variables: {textChannelId}})
  const { data: allMovesData } = useQuery<AllMovesData>(ALL_MOVES)

  const game = gameData?.gameByTextChannelId
  const allMoves = allMovesData?.allMoves
  
  if (loadingGame || !game) {
    return <div> Loading </div>
  }

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
          <Button
            label="Discord channel"
            href={`https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.textChannelId}`}
            target="_blank"
          />
        </ThemeContext.Extend>
      </Header>
      <div>
        <Collapsible direction="horizontal" open={sidePanel < 2}>
          <SidePanel sidePanel={sidePanel} growWidth={sidePanelWidth}>
            {sidePanel === 0 && <p>Character Panel</p>}
            {sidePanel === 1 && !!allMoves && <MovesPanel closePanel={setSidePanel} allMoves={allMoves} />}
          </SidePanel>
        </Collapsible>
        <MainContainer sidePanel={sidePanel} maxPanels={maxSidePanel} shinkWidth={sidePanelWidth}>Main Conatiner</MainContainer>
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
            <Tab title="Character" />
            {allMoves && <Tab title="Moves" />}
          </Tabs>
        </Footer>
      </ThemeContext.Extend>
    </>
  );
};

export default PlayerPage;
