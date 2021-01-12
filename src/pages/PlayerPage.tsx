import { useQuery } from '@apollo/client';
import { useKeycloak } from '@react-keycloak/web';
import { Box, Collapsible, Header, Menu, Tab, Tabs, ThemeContext } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Move } from '../@types/staticDataInterfaces';
import { customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import ALL_MOVES from '../queries/allMoves';
import MovesPanel from '../components/MovesPanel';
import { Footer, MainContainer, SidePanel } from '../components/styledComponents';
import { useGame } from '../contexts/gameContext';

interface AllMovesData {
  allMoves: Move[];
}

const PlayerPage: FC = () => {
  const MAX_SIDE_PANEL = 2;
  const SIDE_PANEL_WIDTH = 34;

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  /**
   * Number that indicates what should be shown in the side panel
   * 0 - CharacterPanel
   * 1 - MovesPanel
   * 2 - None, side panel is closed
   */
  const [sidePanel, setSidePanel] = useState<number>(MAX_SIDE_PANEL);

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();
  const { keycloak } = useKeycloak();
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { game, userGameRole, setGameContext } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: allMovesData } = useQuery<AllMovesData>(ALL_MOVES);
  const allMoves = allMovesData?.allMoves;

  // ------------------------------------------------- Component functions -------------------------------------------------- //

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  useEffect(() => {
    if (!!game && !!userId) {
      const memberIds = game?.players.map((player) => player.id);
      if (!memberIds.includes(userId)) {
        history.push('/menu');
      }
    }
  }, [game, userId, history]);

  // Set the GameContext
  useEffect(() => {
    if (!!gameId && !!userId && !!setGameContext) {
      setGameContext(gameId, userId);
    }
  }, [gameId, userId, setGameContext]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  if (!game || !userId || !userGameRole) {
    return <div> Loading </div>;
  }

  // Redirect if new game/ no character
  // Also, may need to create gameRole
  return (
    <Box fill background="black">
      <Header background="neutral-1">
        <ThemeContext.Extend value={customDefaultButtonStyles}>
          <Menu
            dropBackground="neutral-1"
            label="AW Central"
            items={[
              { label: 'Main menu', onClick: () => history.push('/menu') },
              {
                label: 'Log out',
                onClick: () => keycloak.logout(),
              },
            ]}
          />
        </ThemeContext.Extend>
      </Header>
      <div data-testid="player-page">
        <Collapsible direction="horizontal" open={sidePanel < 2}>
          <SidePanel sidePanel={sidePanel} growWidth={SIDE_PANEL_WIDTH}>
            {sidePanel === 0 && userGameRole && userGameRole.characters?.length === 1 && <p>Character Panel</p>}
            {sidePanel === 1 && !!allMoves && <MovesPanel closePanel={setSidePanel} allMoves={allMoves} />}
          </SidePanel>
        </Collapsible>
        <MainContainer
          fill
          justify="center"
          align="center"
          sidePanel={sidePanel}
          maxPanels={MAX_SIDE_PANEL}
          shinkWidth={SIDE_PANEL_WIDTH}
        ></MainContainer>
      </div>
      <Footer direction="row" justify="between" align="center">
        <ThemeContext.Extend value={customTabStyles}>
          <Tabs
            activeIndex={sidePanel}
            onActive={(tab) => {
              console.log('clicked', tab);
              tab === sidePanel ? setSidePanel(3) : setSidePanel(tab);
            }}
          >
            {userGameRole && userGameRole.characters && userGameRole.characters.length >= 1 && <Tab title="Character" />}
            {allMoves && <Tab title="Moves" />}
          </Tabs>
        </ThemeContext.Extend>
        {/*gameRole && gameRole.characters?.length === 0 && !showCharacterCreator && (
          <Button
            label="CREATE CHARACTER"
            primary
            size="medium"
            onClick={() => setshowCharacterCreator(true)}
            style={{ marginRight: '10px' }}
          />
        ) */}
      </Footer>
    </Box>
  );
};

export default PlayerPage;
