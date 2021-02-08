import React, { FC, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Collapsible, Tab, Tabs, ThemeContext } from 'grommet';

import MovesPanel from '../components/MovesPanel';
import PlaybookPanel from '../components/playbookPanel/PlaybookPanel';
import MessagesPanel from '../components/messagesPanel/MessagesPanel';
import HelpOrInterfereDialog from '../components/dialogs/HelpOrInterfereDialog';
import BarterDialog from '../components/dialogs/BarterDialog';
import MakeWantKnownDialog from '../components/dialogs/MakeWantKnownDialog';
import StabilizeDialog from '../components/dialogs/StabilizeDialog';
import SpeedRecoveryDialog from '../components/dialogs/SpeedRecoveryDialog';
import ReviveDialog from '../components/dialogs/ReviveDialog';
import TreatNpcDialog from '../components/dialogs/TreatNpcDialog';
import ChopperSpecialDialog from '../components/dialogs/ChopperSpecialDialog';
import { Footer, MainContainer, SidePanel } from '../components/styledComponents';
import ALL_MOVES from '../queries/allMoves';
import SET_CHARACTER_BARTER, { SetCharacterBarterData, SetCharacterBarterVars } from '../mutations/setCharacterBarter';
import ADJUST_CHARACTER_HX, { AdjustCharacterHxData, AdjustCharacterHxVars } from '../mutations/adjustCharacterHx';
import SET_CHARACTER_HARM, { SetCharacterHarmData, SetCharacterHarmVars } from '../mutations/setCharacterHarm';
import TOGGLE_STAT_HIGHLIGHT, { ToggleStatHighlightData, ToggleStatHighlightVars } from '../mutations/toggleStatHighlight';
import { MoveActionType, RollType, StatType } from '../@types/enums';
import { HarmInput } from '../@types';
import { CharacterMove, Move } from '../@types/staticDataInterfaces';
import { Character } from '../@types/dataInterfaces';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { useGame } from '../contexts/gameContext';
import { customTabStyles } from '../config/grommetConfig';
import HarmDialog from '../components/dialogs/HarmDialog';
import InflictHarmDialog from '../components/dialogs/InflictHarmDialog';
import HealHarmDialog from '../components/dialogs/HealHarmDialog';
import AngelSpecialDialog from '../components/dialogs/AngelSpecialDialog';
import {
  ANGEL_SPECIAL_NAME,
  CHOPPER_SPECIAL_NAME,
  GUNLUGGER_SPECIAL_NAME,
  HEAL_HARM_NAME,
  HELP_OR_INTERFERE_NAME,
  INFLICT_HARM_NAME,
  MAKE_WANT_KNOWN_NAME,
  OUTDISTANCE_VEHICLE,
  OVERTAKE_VEHICLE,
  REVIVE_SOMEONE_NAME,
  SPEED_RECOVERY_NAME,
  STABILIZE_AND_HEAL_NAME,
  TREAT_NPC_NAME,
} from '../config/constants';
import GameNavbar from '../components/GameNavbar';
import Plus1ForwardPill from '../components/Plus1ForwardPill';
import GunluggerSpecialDialog from '../components/dialogs/GunluggerSpecialDialog';
import RelativeSpeedDialog from '../components/dialogs/RelativeSpeedDialog';

interface AllMovesData {
  allMoves: Move[];
}

export const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/background-image-9.jpg)',
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
  const [dialog, setDialog] = useState<Move | CharacterMove | undefined>();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { game, fetchingGame, userGameRole, setGameContext } = useGame();

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

  const handleToggleHighlight = async (stat: StatType) => {
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
    if (!fetchingGame) {
      if (!!game && !!userId) {
        const memberIds = game?.players.map((player) => player.id);
        if (!memberIds.includes(userId)) {
          history.push('/menu');
        }
      }
    }
  }, [fetchingGame, game, userId, history]);

  // Sets the GameContext
  useEffect(() => {
    if (!fetchingGame && !!gameId && !!userId && !!setGameContext) {
      setGameContext(gameId, userId);
    }
  }, [fetchingGame, gameId, userId, setGameContext]);

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
      <GameNavbar isMc={false} />
      {dialog?.moveAction?.rollType === RollType.harm && (
        <HarmDialog move={dialog} handleClose={() => setDialog(undefined)} />
      )}
      {dialog && [OUTDISTANCE_VEHICLE, OVERTAKE_VEHICLE].includes(dialog.name) && (
        <RelativeSpeedDialog move={dialog} handleClose={() => setDialog(undefined)} />
      )}
      {dialog?.moveAction?.actionType === MoveActionType.barter && (
        <BarterDialog move={dialog} handleClose={() => setDialog(undefined)} />
      )}
      {dialog?.name === HELP_OR_INTERFERE_NAME && (
        <HelpOrInterfereDialog move={dialog} buttonTitle="ROLL" handleClose={() => setDialog(undefined)} />
      )}
      {dialog?.name === MAKE_WANT_KNOWN_NAME && (
        <MakeWantKnownDialog move={dialog} handleClose={() => setDialog(undefined)} />
      )}
      {dialog?.name === INFLICT_HARM_NAME && <InflictHarmDialog move={dialog} handleClose={() => setDialog(undefined)} />}
      {dialog?.name === HEAL_HARM_NAME && <HealHarmDialog move={dialog} handleClose={() => setDialog(undefined)} />}
      {dialog?.name === ANGEL_SPECIAL_NAME && <AngelSpecialDialog move={dialog} handleClose={() => setDialog(undefined)} />}
      {dialog?.name === STABILIZE_AND_HEAL_NAME && (
        <StabilizeDialog move={dialog} handleClose={() => setDialog(undefined)} />
      )}
      {dialog?.name === SPEED_RECOVERY_NAME && (
        <SpeedRecoveryDialog move={dialog} handleClose={() => setDialog(undefined)} />
      )}
      {dialog?.name === REVIVE_SOMEONE_NAME && <ReviveDialog move={dialog} handleClose={() => setDialog(undefined)} />}
      {dialog?.name === TREAT_NPC_NAME && <TreatNpcDialog move={dialog} handleClose={() => setDialog(undefined)} />}
      {dialog?.name === CHOPPER_SPECIAL_NAME && (
        <ChopperSpecialDialog move={dialog} handleClose={() => setDialog(undefined)} />
      )}
      {dialog?.name === GUNLUGGER_SPECIAL_NAME && (
        <GunluggerSpecialDialog move={dialog} handleClose={() => setDialog(undefined)} />
      )}
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
                openDialog={setDialog}
              />
            )}
            {sidePanel === 1 && !!allMoves && <MovesPanel allMoves={allMoves} openDialog={setDialog} />}
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
          <MessagesPanel />
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
        {character?.hasPlusOneForward && <Plus1ForwardPill />}
      </Footer>
    </Box>
  );
};

export default PlayerPage;
