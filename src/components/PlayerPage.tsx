import { useQuery } from '@apollo/client';
import { useKeycloak } from '@react-keycloak/web';
import { Collapsible, Header, Menu, Tab, Tabs, ThemeContext } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { GameRole, Move } from '../@types';
import { customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import ALL_MOVES from '../queries/allMoves';
import GAME_FOR_PLAYER, { GameForPlayerData, GameForPlayerVars } from '../queries/gameForPlayer';
import MovesPanel from './MovesPanel';
import { Footer, MainContainer, SidePanel } from './styledComponents';

interface AllMovesData {
  allMoves: Move[];
}

const PlayerPage: FC = () => {
  const maxSidePanel = 2;
  const sidePanelWidth = 34;
  /**
   * Number that indicates what should be shown in the side panel
   * 0 - CharacterPanel
   * 1 - MovesPanel
   * 2 - None, side panel is closed
   */
  const [sidePanel, setSidePanel] = useState<number>(maxSidePanel);
  const [gameRole, setGameRole] = useState<GameRole | undefined>();

  const history = useHistory();
  const { keycloak } = useKeycloak();
  const { id: userId } = useKeycloakUser();

  const { gameId } = useParams<{ gameId: string }>();

  const { data: gameData, loading: loadingGame } = useQuery<GameForPlayerData, GameForPlayerVars>(GAME_FOR_PLAYER, {
    // @ts-ignore
    variables: { gameId, userId },
  });
  const { data: allMovesData } = useQuery<AllMovesData>(ALL_MOVES);

  // ------------------------------------------ Component functions ------------------------------------------- //

  // ------------------------------------------------ Render -------------------------------------------------- //

  const game = gameData?.gameForPlayer;
  const gameRoles = game?.gameRoles;
  const allMoves = allMovesData?.allMoves;

  useEffect(() => {
    if (!!gameRoles && gameRoles.length > 0) {
      setGameRole(gameRoles[0]);
    }
  }, [gameRoles]);

  if (loadingGame || !game || !userId || !gameRole) {
    return <div> Loading </div>;
  }

  console.log('gameRole', gameRole);
  console.log('gameRole.characters.length', gameRole && gameRole.characters && gameRole.characters.length);
  return (
    <>
      <Header background="neutral-1">
        <ThemeContext.Extend value={customDefaultButtonStyles}>
          <Menu
            dropBackground="neutral-1"
            label="AW Central"
            items={[
              { label: 'Main menu', onClick: () => history.push('/menu') },
              { label: 'Log out', onClick: () => keycloak.logout() },
            ]}
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
        <MainContainer
          fill
          justify="center"
          align="center"
          sidePanel={sidePanel}
          maxPanels={maxSidePanel}
          shinkWidth={sidePanelWidth}
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
            {gameRole && gameRole.characters && gameRole.characters.length >= 1 && <Tab title="Character" />}
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
    </>
  );
};

export default PlayerPage;
