import React, { FC, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useKeycloak } from '@react-keycloak/web';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Collapsible, Header, Menu, Tab, Tabs, ThemeContext } from 'grommet';

import MovesPanel from '../components/MovesPanel';
import PlaybookPanel from '../components/PlaybookPanel';
import { Footer, MainContainer, SidePanel } from '../components/styledComponents';
import ALL_MOVES from '../queries/allMoves';
import SET_CHARACTER_BARTER, { SetCharacterBarterData, SetCharacterBarterVars } from '../mutations/setCharacterBarter';
import ADJUST_CHARACTER_HX, { AdjustCharacterHxData, AdjustCharacterHxVars } from '../mutations/adjustCharacterHx';
import SET_CHARACTER_HARM, { SetCharacterHarmData, SetCharacterHarmVars } from '../mutations/setCharacterHarm';
import TOGGLE_STAT_HIGHLIGHT, { ToggleStatHighlightData, ToggleStatHighlightVars } from '../mutations/toggleStatHighlight';
import { Stats } from '../@types/enums';
import { HarmInput } from '../@types';
import { Move } from '../@types/staticDataInterfaces';
import { Character } from '../@types/dataInterfaces';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { useGame } from '../contexts/gameContext';
import { accentColors, customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';

interface AllMovesData {
  allMoves: Move[];
}

export const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/background-image-8.jpg)',
  position: 'bottom center',
};

const PlayerPage: FC = () => {
  const MAX_SIDE_PANEL = 2;
  const SIDE_PANEL_WIDTH = 50;

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  /**
   * Number that indicates what should be shown in the side panel
   * 0 - PlaybookPanel
   * 1 - MovesPanel
   * 2 - None, side panel is closed
   */
  const [sidePanel, setSidePanel] = useState<number>(2);
  const [character, setCharacter] = useState<Character | undefined>();

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
  const [setCharacterBarter, { loading: settingBarter }] = useMutation<SetCharacterBarterData, SetCharacterBarterVars>(
    SET_CHARACTER_BARTER
  );
  const [adjustCharacterHx, { loading: adjustingHx }] = useMutation<AdjustCharacterHxData, AdjustCharacterHxVars>(
    ADJUST_CHARACTER_HX
  );
  const [setCharacterHarm, { loading: settingHarm }] = useMutation<SetCharacterHarmData, SetCharacterHarmVars>(
    SET_CHARACTER_HARM
  );
  const [toggleStatHighlight, { loading: togglingHighlight }] = useMutation<
    ToggleStatHighlightData,
    ToggleStatHighlightVars
  >(TOGGLE_STAT_HIGHLIGHT);

  // ------------------------------------------------- Component functions -------------------------------------------------- //

  const handleSetBarter = async (amount: number) => {
    if (!!userGameRole && !!character) {
      try {
        await setCharacterBarter({ variables: { gameRoleId: userGameRole.id, characterId: character.id, amount } });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAdjustHx = async (hxId: string, value: number) => {
    if (!!userGameRole && !!character) {
      try {
        await adjustCharacterHx({ variables: { gameRoleId: userGameRole.id, characterId: character.id, hxId, value } });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSetHarm = async (harm: HarmInput) => {
    if (!!userGameRole && !!character) {
      try {
        // @ts-ignore
        delete harm.__typename;
        await setCharacterHarm({ variables: { gameRoleId: userGameRole.id, characterId: character.id, harm } });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleHighlight = async (stat: Stats) => {
    if (!!userGameRole && !!character) {
      try {
        await toggleStatHighlight({ variables: { gameRoleId: userGameRole.id, characterId: character.id, stat } });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const navigateToCharacterCreation = useCallback(
    (step: string) => {
      history.push(`/character-creation/${gameId}?step=${step}`);
    },
    [history, gameId]
  );

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  // Kick the User off the page if they are not a member of the game
  useEffect(() => {
    if (!!game && !!userId) {
      const memberIds = game?.players.map((player) => player.id);
      if (!memberIds.includes(userId)) {
        history.push('/menu');
      }
    }
  }, [game, userId, history]);

  // Sets the GameContext
  useEffect(() => {
    if (!!gameId && !!userId && !!setGameContext) {
      setGameContext(gameId, userId);
    }
  }, [gameId, userId, setGameContext]);

  // Set character in state if character meets minimum requirements
  useEffect(() => {
    if (userGameRole?.characters.length === 1) {
      const character = userGameRole?.characters[0];
      if (!!character.playbook) {
        setCharacter(character);
      }
    }
  }, [userGameRole]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  return (
    <Box fill background={background}>
      <Header
        background={{ color: 'rgba(76, 104, 76, 0.5)' }}
        style={{ borderBottom: `1px solid ${accentColors[0]}` }}
        height="4vh"
      >
        <ThemeContext.Extend value={customDefaultButtonStyles}>
          <Menu
            style={{ backgroundColor: 'transparent' }}
            dropBackground={{ color: 'rgba(76, 104, 76, 0.5)' }}
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
            {sidePanel === 0 && !!character && (
              <PlaybookPanel
                character={character}
                settingBarter={settingBarter}
                adjustingHx={adjustingHx}
                settingHarm={settingHarm}
                togglingHighlight={togglingHighlight}
                handleSetBarter={handleSetBarter}
                handleAdjustHx={handleAdjustHx}
                handleSetHarm={handleSetHarm}
                handleToggleHighlight={handleToggleHighlight}
                navigateToCharacterCreation={navigateToCharacterCreation}
              />
            )}
            {sidePanel === 1 && !!allMoves && <MovesPanel allMoves={allMoves} />}
          </SidePanel>
        </Collapsible>
        <MainContainer
          fill
          justify="center"
          align="center"
          sidePanel={sidePanel}
          maxPanels={MAX_SIDE_PANEL}
          shinkWidth={SIDE_PANEL_WIDTH}
        >
          Main container
        </MainContainer>
      </div>
      <Footer direction="row" justify="between" align="center" height="10vh">
        <ThemeContext.Extend value={customTabStyles}>
          <Tabs
            activeIndex={sidePanel}
            onActive={(tab) => {
              // If user tries to open PlaybookPanel without a minimal character
              tab === 0 && !character && navigateToCharacterCreation('0');
              // Toggle open panel
              tab === sidePanel ? setSidePanel(3) : setSidePanel(tab);
            }}
          >
            {userGameRole && userGameRole.characters && userGameRole.characters.length >= 1 && <Tab title="Playbook" />}
            {allMoves && <Tab title="Moves" />}
          </Tabs>
        </ThemeContext.Extend>
      </Footer>
    </Box>
  );
};

export default PlayerPage;
