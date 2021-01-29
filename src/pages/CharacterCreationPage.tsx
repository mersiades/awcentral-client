import React, { FC, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box } from 'grommet';

import CharacterPlaybookForm from '../components/characterCreation/CharacterPlaybookForm';
import CharacterNameForm from '../components/characterCreation/CharacterNameForm';
import CharacterLooksForm from '../components/characterCreation/CharacterLooksForm';
import CharacterStatsForm from '../components/characterCreation/CharacterStatsForm';
import CharacterGearForm from '../components/characterCreation/CharacterGearForm';
import CharacterMovesForm from '../components/characterCreation/CharacterMovesForm';
import NewGameIntro from '../components/characterCreation/NewGameIntro';
import PlaybookUniqueRouter from '../components/characterCreation/PlaybookUniqueRouter';
import CharacterCreationStepper from '../components/characterCreation/CharacterCreationStepper';
import CharacterHxForm from '../components/characterCreation/CharacterHxForm';
import ScrollableIndicator from '../components/ScrollableIndicator';
import Spinner from '../components/Spinner';
import CloseButton from '../components/CloseButton';
import SET_CHARACTER_STATS, { SetCharacterStatsData, SetCharacterStatsVars } from '../mutations/setCharacterStats';
import SET_CHARACTER_GEAR, { SetCharacterGearData, SetCharacterGearVars } from '../mutations/setCharacterGear';
import SET_CHARACTER_BARTER, { SetCharacterBarterData, SetCharacterBarterVars } from '../mutations/setCharacterBarter';
import SET_CHARACTER_MOVES, { SetCharacterMovesData, SetCharacterMovesVars } from '../mutations/setCharacterMoves';
import SET_CHARACTER_HX, { SetCharacterHxData, SetCharacterHxVars } from '../mutations/setCharacterHx';
import { CharacterCreationSteps, StatType } from '../@types/enums';
import { HxInput } from '../@types';
import { Character } from '../@types/dataInterfaces';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import FINISH_CHARACTER_CREATION, {
  FinishCharacterCreationData,
  FinishCharacterCreationVars,
} from '../mutations/finishCharacterCreation';
import { useGame } from '../contexts/gameContext';
import TOGGLE_STAT_HIGHLIGHT, { ToggleStatHighlightData, ToggleStatHighlightVars } from '../mutations/toggleStatHighlight';

export const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/landscape-smoke.jpg)',
  position: 'top center',
};

const CharacterCreationPage: FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const step = query.get('step');
  const creationStep = !!step ? parseInt(step) : undefined;
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [character, setCharacter] = useState<Character | undefined>();
  const [showScrollable, setShowScrollable] = useState(false);

  // ------------------------------------------------------- Refs -------------------------------------------------------- //
  const containerRef = useRef<HTMLDivElement>(null);
  // -------------------------------------------------- Context hooks ---------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();
  const { game, userGameRole, setGameContext } = useGame();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //

  const [setCharacterStats, { loading: settingStats }] = useMutation<SetCharacterStatsData, SetCharacterStatsVars>(
    SET_CHARACTER_STATS
  );
  const [setCharacterGear, { loading: settingGear }] = useMutation<SetCharacterGearData, SetCharacterGearVars>(
    SET_CHARACTER_GEAR
  );

  const [setCharacterBarter, { loading: settingBarter }] = useMutation<SetCharacterBarterData, SetCharacterBarterVars>(
    SET_CHARACTER_BARTER
  );

  const [setCharacterMoves, { loading: settingMoves }] = useMutation<SetCharacterMovesData, SetCharacterMovesVars>(
    SET_CHARACTER_MOVES
  );
  const [toggleStatHighlight, { loading: togglingHighlight }] = useMutation<
    ToggleStatHighlightData,
    ToggleStatHighlightVars
  >(TOGGLE_STAT_HIGHLIGHT);
  const [setCharacterHx, { loading: settingHx }] = useMutation<SetCharacterHxData, SetCharacterHxVars>(SET_CHARACTER_HX);
  const [finishCharacterCreation, { loading: finishingCreation }] = useMutation<
    FinishCharacterCreationData,
    FinishCharacterCreationVars
  >(FINISH_CHARACTER_CREATION);

  // ---------------------------------------- Component functions and variables ------------------------------------------ //
  const changeStep = (nextStep: number) => {
    !!game && history.push(`/character-creation/${game.id}?step=${nextStep}`);
  };

  const handleSubmitStats = async (statsOptionId: string) => {
    if (!!userGameRole && !!character) {
      try {
        await setCharacterStats({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, statsOptionId },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        changeStep(CharacterCreationSteps.selectGear);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitGear = async (gear: string[], amount: number) => {
    if (!!userGameRole && !!character) {
      try {
        await setCharacterGear({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, gear },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        await setCharacterBarter({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, amount },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        changeStep(CharacterCreationSteps.setUnique);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitCharacterMoves = async (moveIds: string[]) => {
    console.log('moveIds', moveIds);
    if (!!userGameRole && !!character) {
      try {
        await setCharacterMoves({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, moveIds },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        changeStep(CharacterCreationSteps.setHx);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleHighlight = async (stat: StatType) => {
    if (!!userGameRole && !!character) {
      try {
        await toggleStatHighlight({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, stat },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitCharacterHx = async (hxInputs: HxInput[]) => {
    if (!!userGameRole && !!character) {
      try {
        await setCharacterHx({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, hxStats: hxInputs },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFinishCreation = async () => {
    if (!!userGameRole && !!character) {
      try {
        await finishCharacterCreation({
          variables: { gameRoleId: userGameRole.id, characterId: character.id },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        history.push(`/pre-game/${gameId}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const closeNewGameIntro = () => changeStep(CharacterCreationSteps.selectPlaybook);

  const handleScroll = (e: any) => {
    if (!e.currentTarget) {
      return;
    }
    if (e.currentTarget.scrollHeight <= e.currentTarget.offsetHeight) {
      setShowScrollable(false);
      return;
    }

    if (e.currentTarget.scrollTop > 0) {
      setShowScrollable(false);
      return;
    }

    if (e.currentTarget.scrollTop === 0) {
      setShowScrollable(true);
      return;
    }
  };

  // --------------------------------------------------- Effects ----------------------------------------------------- //
  // Put the User's Character into component state
  useEffect(() => {
    if (!!userGameRole?.characters && userGameRole.characters.length === 1) {
      setCharacter(userGameRole.characters[0]);
    }
  }, [userGameRole, userId]);

  useEffect(() => {
    if (!step) {
      if (!!character) {
        history.push(`/character-creation/${gameId}?step=${1}`);
      } else {
        history.push(`/character-creation/${gameId}?step=${0}`);
      }
    }

    if (step === '0' && !!character) {
      history.push(`/character-creation/${gameId}?step=${1}`);
    }
  }, [step, character, gameId, history]);

  useEffect(() => {
    if (!!game && !!userId) {
      const memberIds = game?.players.map((player) => player.id);
      if (!memberIds.includes(userId)) {
        history.push('/menu');
      }
    }
  }, [game, userId, history]);

  useEffect(() => {
    if (!!containerRef.current) {
      containerRef.current.addEventListener('scroll', (e) => handleScroll(e));
      if (containerRef.current.scrollHeight > containerRef.current.offsetHeight) {
        setShowScrollable(true);
      } else {
        setShowScrollable(false);
      }
      containerRef.current.scrollTop = 0;
    }
  }, [containerRef, step]);

  // Set the GameContext
  useEffect(() => {
    if (!!gameId && !!userId && !!setGameContext) {
      setGameContext(gameId, userId);
    }
  }, [gameId, userId, setGameContext]);

  if (!creationStep) {
    return <Spinner />;
  }

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  return (
    <Box
      data-testid="character-creation-page"
      ref={containerRef}
      fill
      background={background}
      overflow={{ vertical: 'auto' }}
    >
      {!game && (
        <div style={{ position: 'absolute', top: 'calc(50vh - 12px)', left: 'calc(50vw - 12px)' }}>
          <Spinner />
        </div>
      )}
      <ScrollableIndicator show={showScrollable} />
      <CloseButton handleClose={() => history.goBack()} />

      <CharacterCreationStepper />
      <Box flex="grow">
        {creationStep === CharacterCreationSteps.intro && !!game && <NewGameIntro closeNewGameIntro={closeNewGameIntro} />}
        {creationStep === CharacterCreationSteps.selectPlaybook && <CharacterPlaybookForm />}
        {creationStep === CharacterCreationSteps.selectName && character && character.playbook && <CharacterNameForm />}
        {creationStep === CharacterCreationSteps.selectLooks && character && character.name && character.playbook && (
          <CharacterLooksForm />
        )}
        {creationStep === CharacterCreationSteps.selectStats && character && character.name && character.playbook && (
          <CharacterStatsForm
            characterName={character.name}
            settingStats={settingStats}
            existingStatOption={character.statsBlock?.statsOptionId}
            playbookType={character?.playbook}
            handleSubmitStats={handleSubmitStats}
          />
        )}
        {creationStep === CharacterCreationSteps.selectGear && character && character.name && character.playbook && (
          <CharacterGearForm
            existingGear={character.gear}
            characterName={character.name}
            settingGear={settingGear}
            settingBarter={settingBarter}
            playbookType={character?.playbook}
            handleSubmitGear={handleSubmitGear}
          />
        )}
        {creationStep === CharacterCreationSteps.setUnique && character && character.name && character.playbook && (
          <PlaybookUniqueRouter />
        )}
        {creationStep === CharacterCreationSteps.selectMoves && character && !!character.name && character.playbook && (
          <CharacterMovesForm
            playbookType={character.playbook}
            characterName={character.name}
            settingMoves={settingMoves}
            handleSubmitCharacterMoves={handleSubmitCharacterMoves}
            existingMoves={character.characterMoves}
          />
        )}
        {creationStep === CharacterCreationSteps.setHx && !!character && !!character.playbook && (
          <CharacterHxForm
            playbookType={character.playbook}
            character={character}
            settingHx={settingHx}
            togglingHighlight={togglingHighlight}
            handleToggleHighlight={handleToggleHighlight}
            finishingCreation={finishingCreation}
            handleSubmitCharacterHx={handleSubmitCharacterHx}
            handleFinishCreation={handleFinishCreation}
          />
        )}
      </Box>
    </Box>
  );
};

export default CharacterCreationPage;
