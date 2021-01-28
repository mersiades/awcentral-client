import React, { FC, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Box } from 'grommet';

import PlaybooksSelector from '../components/characterCreation/CharacterPlaybookForm';
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
import PLAYBOOKS, { PlaybooksData } from '../queries/playbooks';
import CREATE_CHARACTER, { CreateCharacterData, CreateCharacterVars } from '../mutations/createCharacter';
import SET_CHARACTER_PLAYBOOK, {
  SetCharacterPlaybookData,
  SetCharacterPlaybookVars,
} from '../mutations/setCharacterPlaybook';
import SET_CHARACTER_NAME, { SetCharacterNameData, SetCharacterNameVars } from '../mutations/setCharacterName';
import SET_CHARACTER_LOOK, { SetCharacterLookData, SetCharacterLookVars } from '../mutations/setCharacterLook';
import SET_CHARACTER_STATS, { SetCharacterStatsData, SetCharacterStatsVars } from '../mutations/setCharacterStats';
import SET_CHARACTER_GEAR, { SetCharacterGearData, SetCharacterGearVars } from '../mutations/setCharacterGear';
import SET_CHARACTER_BARTER, { SetCharacterBarterData, SetCharacterBarterVars } from '../mutations/setCharacterBarter';

import SET_CHARACTER_MOVES, { SetCharacterMovesData, SetCharacterMovesVars } from '../mutations/setCharacterMoves';
import SET_CUSTOM_WEAPONS, { SetCustomWeaponsData, SetCustomWeaponsVars } from '../mutations/setCustomWeapons';
import SET_CHARACTER_HX, { SetCharacterHxData, SetCharacterHxVars } from '../mutations/setCharacterHx';
import { PlaybookType, CharacterCreationSteps, LookType, StatType } from '../@types/enums';
import { HxInput } from '../@types';
import { Character } from '../@types/dataInterfaces';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import FINISH_CHARACTER_CREATION, {
  FinishCharacterCreationData,
  FinishCharacterCreationVars,
} from '../mutations/finishCharacterCreation';
import { useGame } from '../contexts/gameContext';
import TOGGLE_STAT_HIGHLIGHT, { ToggleStatHighlightData, ToggleStatHighlightVars } from '../mutations/toggleStatHighlight';
import WarningDialog from '../components/dialogs/WarningDialog';

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
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [creationStep, setCreationStep] = useState<number>(step ? parseInt(step) : 0);
  const [character, setCharacter] = useState<Character | undefined>();
  const [showResetWarning, setShowResetWarning] = useState<PlaybookType | undefined>();
  const [showScrollable, setShowScrollable] = useState(false);

  // ------------------------------------------------------- Refs -------------------------------------------------------- //
  const containerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------- Context hooks ---------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();
  const { game, userGameRole, setGameContext } = useGame();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: playbooksData } = useQuery<PlaybooksData>(PLAYBOOKS);
  const [createCharacter, { loading: creatingCharacter }] = useMutation<CreateCharacterData, CreateCharacterVars>(
    CREATE_CHARACTER
  );
  const [setCharacterPlaybook, { loading: settingPlaybook }] = useMutation<
    SetCharacterPlaybookData,
    SetCharacterPlaybookVars
  >(SET_CHARACTER_PLAYBOOK);
  const [setCharacterName, { loading: settingName }] = useMutation<SetCharacterNameData, SetCharacterNameVars>(
    SET_CHARACTER_NAME
  );
  const [setCharacterLook, { loading: settingLooks }] = useMutation<SetCharacterLookData, SetCharacterLookVars>(
    SET_CHARACTER_LOOK
  );
  const [setCharacterStats, { loading: settingStats }] = useMutation<SetCharacterStatsData, SetCharacterStatsVars>(
    SET_CHARACTER_STATS
  );
  const [setCharacterGear, { loading: settingGear }] = useMutation<SetCharacterGearData, SetCharacterGearVars>(
    SET_CHARACTER_GEAR
  );

  const [setCharacterBarter, { loading: settingBarter }] = useMutation<SetCharacterBarterData, SetCharacterBarterVars>(
    SET_CHARACTER_BARTER
  );

  const [setCustomWeapons, { loading: settingCustomWeapons }] = useMutation<SetCustomWeaponsData, SetCustomWeaponsVars>(
    SET_CUSTOM_WEAPONS
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

  const playbooks = playbooksData?.playbooks;

  // ---------------------------------------- Component functions and variables ------------------------------------------ //

  const checkPlaybookReset = (playbookType: PlaybookType) => {
    if (
      !!userGameRole &&
      !!userGameRole.characters &&
      userGameRole.characters.length > 0 &&
      !!userGameRole.characters[0].playbook &&
      userGameRole.characters[0].playbook !== playbookType
    ) {
      setShowResetWarning(playbookType);
    } else {
      handlePlaybookSelect(playbookType);
    }
  };

  const handlePlaybookSelect = async (playbookType: PlaybookType) => {
    if (!!userGameRole) {
      if (userGameRole.characters?.length === 0) {
        let characterId;
        try {
          const { data: characterData } = await createCharacter({ variables: { gameRoleId: userGameRole?.id } });
          characterId = characterData?.createCharacter.id;
        } catch (error) {
          console.error(error);
        }
        if (!characterId) {
          console.warn('No character id, playbook not set');
          return;
        }
        try {
          await setCharacterPlaybook({
            variables: { gameRoleId: userGameRole.id, characterId, playbookType },
            // refetchQueries: [{ query: GAME, variables: { gameId } }],
          });
        } catch (error) {
          console.error(error);
        }
      } else if (userGameRole.characters?.length === 1) {
        try {
          await setCharacterPlaybook({
            variables: { gameRoleId: userGameRole.id, characterId: userGameRole.characters[0].id, playbookType },
            // refetchQueries: [{ query: GAME, variables: { gameId } }],
          });
        } catch (error) {
          console.error(error);
        }
      }
      setShowResetWarning(undefined);
      setCreationStep((prevState) => prevState + 1);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitName = async (name: string) => {
    if (!!userGameRole && !!character) {
      try {
        await setCharacterName({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, name },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevStep) => prevStep + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitLook = async (look: string, category: LookType) => {
    // console.log('handleSubmitLook');
    if (!!userGameRole && !!character) {
      try {
        const data = await setCharacterLook({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, look, category },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        if (data.data?.setCharacterLook.looks?.length === 5) {
          setCreationStep((prevState) => prevState + 1);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitStats = async (statsOptionId: string) => {
    if (!!userGameRole && !!character) {
      try {
        await setCharacterStats({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, statsOptionId },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
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
        setCreationStep((prevState) => prevState + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitCustomWeapons = async (weapons: string[]) => {
    if (!!userGameRole && !!character) {
      try {
        await setCustomWeapons({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, weapons },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
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
        setCreationStep((prevState) => prevState + 1);
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

  const closeNewGameIntro = () => setCreationStep((prevState) => prevState + 1);

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

  // -------------------------------------------------- UseEffects ---------------------------------------------------- //
  // Put the User's Character into component state
  useEffect(() => {
    if (!!userGameRole?.characters && userGameRole.characters.length === 1) {
      setCharacter(userGameRole.characters[0]);
    }
  }, [userGameRole, userId]);

  // If page is loading but character is already partially created,
  // set creationStep to appropriate step
  useEffect(() => {
    if (
      character &&
      (creationStep === CharacterCreationSteps.intro || creationStep === CharacterCreationSteps.selectPlaybook)
    ) {
      if (!!character.playbook && !character.name) {
        setCreationStep(2);
      } else if (!!character.name && (!character.looks || character.looks.length < 5)) {
        setCreationStep(3);
      } else if (!!character.looks && character.looks.length >= 5 && character.statsBlock?.stats.length < 5) {
        setCreationStep(4);
      } else if (!!character.statsBlock && character.statsBlock?.stats.length === 5 && character.gear.length === 0) {
        setCreationStep(5);
      } else if (!!character.gear && character.gear.length > 0 && !character.playbookUnique) {
        setCreationStep(6);
      } else if (!!character.playbookUnique && character.characterMoves?.length === 0) {
        setCreationStep(7);
      } else if (!!character.characterMoves && character.characterMoves?.length > 0 /* TODO: case where no Hx */) {
        setCreationStep(8);
      }
    }
  }, [character, creationStep]);

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
  }, [containerRef, creationStep]);

  // Set the GameContext
  useEffect(() => {
    if (!!gameId && !!userId && !!setGameContext) {
      setGameContext(gameId, userId);
    }
  }, [gameId, userId, setGameContext]);

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  return (
    <Box
      data-testid="character-creation-page"
      ref={containerRef}
      fill
      background={background}
      overflow={{ vertical: 'auto' }}
    >
      {!playbooks ||
        (!game && (
          <div style={{ position: 'absolute', top: 'calc(50vh - 12px)', left: 'calc(50vw - 12px)' }}>
            <Spinner />
          </div>
        ))}
      <ScrollableIndicator show={showScrollable} />
      <CloseButton handleClose={() => history.goBack()} />
      {!!showResetWarning && (
        <WarningDialog
          title="Switch playbook?"
          buttonTitle="SWITCH"
          text="Changing the playbook will reset the character."
          handleClose={() => setShowResetWarning(undefined)}
          handleConfirm={() => handlePlaybookSelect(showResetWarning)}
        />
      )}

      <CharacterCreationStepper
        character={character}
        playbookType={character?.playbook}
        currentStep={creationStep}
        setCreationStep={setCreationStep}
      />
      <Box flex="grow">
        {creationStep === 0 && !!game && <NewGameIntro game={game} closeNewGameIntro={closeNewGameIntro} />}
        {creationStep === CharacterCreationSteps.selectPlaybook && (
          <PlaybooksSelector
            playbooks={playbooks}
            playbook={character?.playbook}
            checkPlaybookReset={checkPlaybookReset}
            settingPlaybook={settingPlaybook}
            creatingCharacter={creatingCharacter}
          />
        )}
        {creationStep === CharacterCreationSteps.selectName && character && character.playbook && (
          <CharacterNameForm
            playbookType={character?.playbook}
            settingName={settingName}
            handleSubmitName={handleSubmitName}
            existingName={character.name}
          />
        )}
        {creationStep === CharacterCreationSteps.selectLooks && character && character.name && character.playbook && (
          <CharacterLooksForm
            playbookType={character?.playbook}
            characterName={character.name}
            settingLooks={settingLooks}
            handleSubmitLook={handleSubmitLook}
            existingLooks={{
              gender: character.looks?.filter((look) => look.category === LookType.gender)[0]?.look || '',
              clothes: character.looks?.filter((look) => look.category === LookType.clothes)[0]?.look || '',
              face: character.looks?.filter((look) => look.category === LookType.face)[0]?.look || '',
              eyes: character.looks?.filter((look) => look.category === LookType.eyes)[0]?.look || '',
              body: character.looks?.filter((look) => look.category === LookType.body)[0]?.look || '',
            }}
          />
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
          <PlaybookUniqueRouter
            playbookType={character.playbook}
            characterName={character.name}
            settingCustomWeapons={settingCustomWeapons}
            existingAngelKit={character.playbookUnique?.angelKit}
            existingCustomWeapons={character.playbookUnique?.customWeapons}
            existingBrainerGear={character.playbookUnique?.brainerGear}
            handleSubmitCustomWeapons={handleSubmitCustomWeapons}
            setCreationStep={setCreationStep}
          />
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
