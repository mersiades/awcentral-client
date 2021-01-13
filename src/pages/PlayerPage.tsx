import { useMutation, useQuery } from '@apollo/client';
import { useKeycloak } from '@react-keycloak/web';
import { Box, Collapsible, Header, Menu, Tab, Tabs, ThemeContext } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Move } from '../@types/staticDataInterfaces';
import { accentColors, customDefaultButtonStyles, customTabStyles } from '../config/grommetConfig';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import ALL_MOVES from '../queries/allMoves';
import MovesPanel from '../components/MovesPanel';
import { Footer, MainContainer, SidePanel } from '../components/styledComponents';
import { useGame } from '../contexts/gameContext';
import { Character } from '../@types/dataInterfaces';
import CharacterSheet from '../components/CharacterSheet';
import SET_CHARACTER_BARTER, { SetCharacterBarterData, SetCharacterBarterVars } from '../mutations/setCharacterBarter';
import ADJUST_CHARACTER_HX, { AdjustCharacterHxData, AdjustCharacterHxVars } from '../mutations/adjustCharacterHx';
import { HarmInput } from '../@types';
import SET_CHARACTER_HARM, { SetCharacterHarmData, SetCharacterHarmVars } from '../mutations/setCharacterHarm';

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
   * 0 - CharacterPanel
   * 1 - MovesPanel
   * 2 - None, side panel is closed
   */
  const [sidePanel, setSidePanel] = useState<number>(0);
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

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

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

  // Handles different degrees of character creation completion
  useEffect(() => {
    if (!!userGameRole && userGameRole.characters.length === 1) {
      if (!userGameRole.characters[0].hasCompletedCharacterCreation) {
        history.push(`/character-creation/${gameId}`);
      } else {
        setCharacter(userGameRole.characters[0]);
      }
    } else if (!!userGameRole && userGameRole.characters.length > 1) {
      // TODO: handle case when Player has more than one Character
    }
  }, [userGameRole, gameId, history]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  if (!game || !userId || !userGameRole) {
    return <div> Loading </div>;
  }

  // Redirect if new game/ no character
  // Also, may need to create gameRole
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
              <CharacterSheet
                character={character}
                settingBarter={settingBarter}
                adjustingHx={adjustingHx}
                settingHarm={settingHarm}
                handleSetBarter={handleSetBarter}
                handleAdjustHx={handleAdjustHx}
                handleSetHarm={handleSetHarm}
              />
            )}
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
      <Footer direction="row" justify="between" align="center" height="10vh">
        <ThemeContext.Extend value={customTabStyles}>
          <Tabs
            activeIndex={sidePanel}
            onActive={(tab) => {
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
