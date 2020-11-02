import { useQuery } from '@apollo/client';
import { Button, Collapsible, Header, Menu, Tab, Tabs, ThemeContext } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Game, GameRole, Move, User } from '../@types';
import { customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';
import { useAuth } from '../contexts/authContext';
import { useDiscordUser } from '../contexts/discordUserContext';
import ALL_MOVES from '../queries/allMoves';
// import GAME_BY_TEXT_CHANNEL_ID from '../queries/gameByTextChannelId';
import GAME_FOR_PLAYER from '../queries/gameForPlayer';
import USER_BY_DISCORD_ID from '../queries/userByDiscordId';
import { AWCENTRAL_GUILD_ID } from '../services/discordService';
import MovesPanel from './MovesPanel';
import { Footer, MainContainer, SidePanel } from './styledComponents';

interface GameData {
  gameForPlayer: Game
}

interface GameVars {
  textChannelId: string
}

interface AllMovesData {
  allMoves: Move[]
}

interface UserByDiscordIdData {
  userByDiscordId: User
}

interface UserByDiscordIdVars {
  discordId?: string // TODO: change so that discordId can't be undefined
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
  const [gameRole, setGameRole] = useState<GameRole | undefined>()
  
  const history = useHistory();
  const { logOut } = useAuth();
  const { discordId } = useDiscordUser()
  const { data: userData, loading: loadingUser } = useQuery<UserByDiscordIdData, UserByDiscordIdVars>(USER_BY_DISCORD_ID, { variables: { discordId }, skip: !discordId });
  const { gameID: textChannelId} = useParams<{ gameID: string}>()
  const userId = userData?.userByDiscordId.id
  // @ts-ignore
  const { data: gameData, loading: loadingGame} = useQuery<GameData, GameVars>(GAME_FOR_PLAYER, {variables: { textChannelId, userId }})
  const { data: allMovesData } = useQuery<AllMovesData>(ALL_MOVES)

  const game = gameData?.gameForPlayer
  const gameRoles = game?.gameRoles
  const allMoves = allMovesData?.allMoves

  useEffect(() => {
    if (!!gameRoles && gameRoles.length > 0) {
      setGameRole(gameRoles[0])
    }
  }, [gameRoles])
  
  if (loadingGame || !game || loadingUser || !userId || !gameRole) {
    return <div> Loading </div>
  }

  console.log('gameRole', gameRole)
  console.log('gameRole.characters.length', gameRole && gameRole.characters && gameRole.characters.length)
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
            {sidePanel === 0 && gameRole && gameRole.characters?.length === 1 && <p>Character Panel</p>}
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
            {gameRole && gameRole.characters?.length === 1 && <Tab title="Character" />}
            {allMoves && <Tab title="Moves" />}
          </Tabs>
        </Footer>
      </ThemeContext.Extend>
    </>
  );
};

export default PlayerPage;
