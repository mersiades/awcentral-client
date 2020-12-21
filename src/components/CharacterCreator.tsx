import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Box } from 'grommet';

import PlaybooksSelector from './PlaybookSelector';
import CharacterNameForm from './CharacterNameForm';
import CharacterLooksForm from './CharacterLooksForm';
import CharacterStatsForm from './CharacterStatsForm';
import CharacterGearForm from './CharacterGearForm';
import CharacterCreationStepper from './CharacterCreationStepper';
import NewGameIntro from './NewGameIntro';
import Spinner from './Spinner';
import CREATE_CHARACTER, { CreateCharacterData, CreateCharacterVars } from '../mutations/createCharacter';
import SET_CHARACTER_PLAYBOOK, {
  SetCharacterPlaybookData,
  SetCharacterPlaybookVars,
} from '../mutations/setCharacterPlaybook';
import GAME_FOR_PLAYER, { GameForPlayerData, GameForPlayerVars } from '../queries/gameForPlayer';
import PLAYBOOKS, { PlaybooksData } from '../queries/playbooks';
import SET_CHARACTER_NAME, { SetCharacterNameData, SetCharacterNameVars } from '../mutations/setCharacterName';
import SET_CHARACTER_LOOK, { SetCharacterLookData, SetCharacterLookVars } from '../mutations/setCharacterLook';
import SET_CHARACTER_STATS, { SetCharacterStatsData, SetCharacterStatsVars } from '../mutations/setCharacterStats';
import { PlayBooks, CharacterCreationSteps, LookCategories } from '../@types/enums';
import { Character, GameRole } from '../@types';
import { useKeycloakUser } from '../contexts/keycloakUserContext';

const CharacterCreator: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  /**
   * Step 0 = Choose a playbook
   */
  const [creationStep, setCreationStep] = useState<number>(0);
  const [character, setCharacter] = useState<Character | undefined>();
  const [gameRole, setGameRole] = useState<GameRole | undefined>();

  // -------------------------------------------------- Context hooks ---------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { gameId } = useParams<{ gameId: string }>();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: playbooksData, loading: loadingPlaybooks } = useQuery<PlaybooksData>(PLAYBOOKS);
  const { data: gameData, loading: loadingGame } = useQuery<GameForPlayerData, GameForPlayerVars>(GAME_FOR_PLAYER, {
    // @ts-ignore
    variables: { gameId, userId },
  });
  const [createCharacter] = useMutation<CreateCharacterData, CreateCharacterVars>(CREATE_CHARACTER);
  const [setCharacterPlaybook] = useMutation<SetCharacterPlaybookData, SetCharacterPlaybookVars>(SET_CHARACTER_PLAYBOOK);
  const [setCharacterName] = useMutation<SetCharacterNameData, SetCharacterNameVars>(SET_CHARACTER_NAME);
  const [setCharacterLook] = useMutation<SetCharacterLookData, SetCharacterLookVars>(SET_CHARACTER_LOOK);
  const [setCharacterStats] = useMutation<SetCharacterStatsData, SetCharacterStatsVars>(SET_CHARACTER_STATS);

  const playbooks = playbooksData?.playbooks;
  const game = gameData?.gameForPlayer;
  const gameRoles = game?.gameRoles;

  // ---------------------------------------- Component functions and variables ------------------------------------------ //
  const handlePlaybookSelect = async (playbookType: PlayBooks) => {
    if (!!gameRole) {
      let characterId;
      try {
        const { data: characterData } = await createCharacter({ variables: { gameRoleId: gameRole?.id } });
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
          variables: { gameRoleId: gameRole.id, characterId, playbookType },
          refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { gameId, userId } }],
        });
      } catch (error) {
        console.error(error);
      }

      setCreationStep((prevState) => prevState + 1);
    }
  };

  const handleSubmitName = async (name: string) => {
    if (!!gameRole && !!character) {
      try {
        await setCharacterName({
          variables: { gameRoleId: gameRole.id, characterId: character.id, name },
          refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { gameId, userId } }],
        });
        setCreationStep((prevStep) => prevStep + 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitLook = async (look: string, category: LookCategories) => {
    if (!!gameRole && !!character) {
      try {
        const data = await setCharacterLook({
          variables: { gameRoleId: gameRole.id, characterId: character.id, look, category },
          refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { gameId, userId } }],
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
    console.log('statsOptionId', statsOptionId);
    if (!!gameRole && !!character) {
      try {
        await setCharacterStats({
          variables: { gameRoleId: gameRole.id, characterId: character.id, statsOptionId },
          refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { gameId, userId } }],
        });
        setCreationStep((prevState) => prevState + 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitGear = () => console.log('submitting gear');

  const closeNewGameIntro = () => setCreationStep((prevState) => prevState + 1);

  // -------------------------------------------------- UseEffects ---------------------------------------------------- //
  useEffect(() => {
    if (!!gameRoles && gameRoles.length > 0) {
      setGameRole(gameRoles[0]);
      if (!!gameRoles[0].characters && gameRoles[0].characters.length === 1) {
        setCharacter(gameRoles[0].characters[0]);
      }
    }
  }, [gameRoles]);

  // If page is loading but character is already partially created,
  // set creationStep to appropriate step
  useEffect(() => {
    if (character && creationStep === CharacterCreationSteps.intro) {
      if (!!character.playbook && !character.name) {
        setCreationStep(2);
      } else if (!!character.name && (!character.looks || character.looks.length < 5)) {
        setCreationStep(3);
      } else if (!!character.looks && character.looks.length < 5) {
        setCreationStep(4);
      } else if (!!character.statsBlock && character.statsBlock.stats.length === 5) {
        setCreationStep(5);
      }
    }
  }, [character, creationStep]);

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  // console.log('playbooks', playbooks);
  // console.log('game', game);
  if (loadingPlaybooks || loadingGame || !playbooks || !game) {
    return (
      <Box fill background="black" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }
  // console.log('character', character);
  // console.log('creationStep', creationStep);
  return (
    <Box fill background="black">
      <CharacterCreationStepper character={character} currentStep={creationStep} setCreationStep={setCreationStep} />
      {creationStep === 0 && <NewGameIntro game={game} closeNewGameIntro={closeNewGameIntro} />}
      {creationStep === CharacterCreationSteps.selectPlaybook && (
        <PlaybooksSelector
          playbooks={playbooks}
          playbook={character?.playbook}
          handlePlaybookSelect={handlePlaybookSelect}
        />
      )}
      {creationStep === CharacterCreationSteps.selectName && character && character.playbook && (
        <CharacterNameForm
          playbookType={character?.playbook}
          handleSubmitName={handleSubmitName}
          existingName={character.name}
        />
      )}
      {creationStep === CharacterCreationSteps.selectLooks && character && character.name && character.playbook && (
        <CharacterLooksForm
          playbookType={character?.playbook}
          characterName={character.name}
          handleSubmitLook={handleSubmitLook}
          existingLooks={{
            gender: character.looks?.filter((look) => look.category === LookCategories.gender)[0]?.look || '',
            clothes: character.looks?.filter((look) => look.category === LookCategories.clothes)[0]?.look || '',
            face: character.looks?.filter((look) => look.category === LookCategories.face)[0]?.look || '',
            eyes: character.looks?.filter((look) => look.category === LookCategories.eyes)[0]?.look || '',
            body: character.looks?.filter((look) => look.category === LookCategories.body)[0]?.look || '',
          }}
        />
      )}
      {creationStep === CharacterCreationSteps.selectStats && character && character.name && character.playbook && (
        <CharacterStatsForm
          characterName={character.name}
          playbookType={character?.playbook}
          handleSubmitStats={handleSubmitStats}
        />
      )}
      {creationStep === CharacterCreationSteps.selectGear && character && character.name && character.playbook && (
        <CharacterGearForm
          characterName={character.name}
          playbookType={character?.playbook}
          handleSubmitGear={handleSubmitGear}
        />
      )}
    </Box>
  );
};

export default CharacterCreator;
