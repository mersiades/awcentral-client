import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Heading, Layer, Paragraph } from 'grommet';

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
import SET_CHARACTER_GEAR, { SetCharacterGearData, SetCharacterGearVars } from '../mutations/setCharacterGear';
import PlaybookUniqueFormContainer from './PlaybookUniqueFormContainer';
import SET_BRAINER_GEAR, { SetBrainerGearData, SetBrainerGearVars } from '../mutations/setBrainerGear';
import SET_ANGEL_KIT, { SetAngelKitData, SetAngelKitVars } from '../mutations/setAngelKit';
import CharacterMovesForm from './CharacterMovesForm';

export const resetWarningBackground = {
  color: 'black',
  dark: true,
  position: 'center bottom',
  size: 'cover',
  image: 'url(/images/background-image-6.jpg)',
};

export const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/landscape-smoke.jpg)',
  position: 'top center',
};

const CharacterCreator: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  /**
   * Step 0 = Choose a playbook
   */
  const [creationStep, setCreationStep] = useState<number>(0);
  const [character, setCharacter] = useState<Character | undefined>();
  const [gameRole, setGameRole] = useState<GameRole | undefined>();
  const [showResetWarning, setShowResetWarning] = useState<PlayBooks | undefined>();

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
  const [setCharacterGear] = useMutation<SetCharacterGearData, SetCharacterGearVars>(SET_CHARACTER_GEAR);
  const [setBrainerGear] = useMutation<SetBrainerGearData, SetBrainerGearVars>(SET_BRAINER_GEAR);
  const [setAngelKit] = useMutation<SetAngelKitData, SetAngelKitVars>(SET_ANGEL_KIT);

  const playbooks = playbooksData?.playbooks;
  const game = gameData?.gameForPlayer;
  const gameRoles = game?.gameRoles;

  // ---------------------------------------- Component functions and variables ------------------------------------------ //

  const checkPlaybookReset = (playbookType: PlayBooks) => {
    if (
      !!gameRole &&
      !!gameRole.characters &&
      gameRole.characters.length > 0 &&
      !!gameRole.characters[0].playbook &&
      gameRole.characters[0].playbook !== playbookType
    ) {
      setShowResetWarning(playbookType);
    } else {
      handlePlaybookSelect(playbookType);
    }
  };
  const handlePlaybookSelect = async (playbookType: PlayBooks) => {
    if (!!gameRole) {
      if (gameRole.characters?.length === 0) {
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
      } else if (gameRole.characters?.length === 1) {
        try {
          await setCharacterPlaybook({
            variables: { gameRoleId: gameRole.id, characterId: gameRole.characters[0].id, playbookType },
            refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { gameId, userId } }],
          });
        } catch (error) {
          console.error(error);
        }
      }
      setShowResetWarning(undefined);
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

  const handleSubmitGear = async (gear: string[]) => {
    if (!!gameRole && !!character) {
      try {
        await setCharacterGear({
          variables: { gameRoleId: gameRole.id, characterId: character.id, gear },
          refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { gameId, userId } }],
        });
        setCreationStep((prevState) => prevState + 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitBrainerGear = async (brainerGear: string[]) => {
    if (!!gameRole && !!character) {
      try {
        await setBrainerGear({
          variables: { gameRoleId: gameRole.id, characterId: character.id, brainerGear },
          refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { gameId, userId } }],
        });
        setCreationStep((prevState) => prevState + 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitAngelKit = async (stock: number, hasSupplier: boolean) => {
    if (!!gameRole && !!character) {
      try {
        await setAngelKit({
          variables: { gameRoleId: gameRole.id, characterId: character.id, stock, hasSupplier },
          refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { gameId, userId } }],
        });
        setCreationStep((prevState) => prevState + 1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitCustomWeapons = () => console.log('submitting');

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
      } else if (!!character.looks && character.looks.length >= 5 && character.statsBlock.stats.length < 5) {
        setCreationStep(4);
      } else if (!!character.statsBlock && character.statsBlock.stats.length === 5 && character.gear.length === 0) {
        setCreationStep(5);
      } else if (!!character.gear && character.gear.length > 0 && !character.playbookUnique) {
        setCreationStep(6);
      } else if (!!character.playbookUnique /* TODO: add case where characterMoves are null */) {
        setCreationStep(7);
      }
    }
  }, [character, creationStep]);

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  if (loadingPlaybooks || loadingGame || !playbooks || !game) {
    return (
      <Box fill background="black" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box fill background={background} overflow={{ vertical: 'auto' }}>
      {!!showResetWarning && (
        <Layer onEsc={() => setShowResetWarning(undefined)} onClickOutside={() => setShowResetWarning(undefined)}>
          <Box
            direction="column"
            fill
            align="center"
            justify="center"
            pad="24px"
            gap="24px"
            border={{ color: 'neutral-1' }}
            background={resetWarningBackground}
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
            style={{ boxShadow: '0 0 15px 1px #000, 0 0 20px 3px #000' }}
          >
            <Heading
              level={4}
              alignSelf="start"
              style={{ textShadow: '0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000' }}
            >
              Switch playbook?
            </Heading>
            <Paragraph style={{ textShadow: '0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000' }}>
              Changing the playbook will reset the character.
            </Paragraph>
            <Box fill="horizontal" direction="row" justify="end" gap="small">
              <Button
                label="CANCEL"
                style={{
                  background: 'transparent',
                  textShadow: '0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000',
                  boxShadow: '0 0 3px 1px #000, 0 0 5px 3px #000',
                }}
                onClick={() => setShowResetWarning(undefined)}
              />
              <Button
                label="SWITCH"
                primary
                style={{ boxShadow: '0 0 3px 1px #000, 0 0 5px 3px #000' }}
                onClick={() => handlePlaybookSelect(showResetWarning)}
              />
            </Box>
          </Box>
        </Layer>
      )}

      <CharacterCreationStepper
        character={character}
        playbookType={character?.playbook}
        currentStep={creationStep}
        setCreationStep={setCreationStep}
      />

      {creationStep === 0 && <NewGameIntro game={game} closeNewGameIntro={closeNewGameIntro} />}
      {creationStep === CharacterCreationSteps.selectPlaybook && (
        <PlaybooksSelector playbooks={playbooks} playbook={character?.playbook} checkPlaybookReset={checkPlaybookReset} />
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
          existingGear={character.gear}
          characterName={character.name}
          playbookType={character?.playbook}
          handleSubmitGear={handleSubmitGear}
        />
      )}
      {creationStep === CharacterCreationSteps.setUnique && character && character.name && character.playbook && (
        <PlaybookUniqueFormContainer
          playbookType={character.playbook}
          characterName={character.name}
          handleSubmitBrainerGear={handleSubmitBrainerGear}
          handleSubmitAngelKit={handleSubmitAngelKit}
          handleSubmitCustomWeapons={handleSubmitCustomWeapons}
        />
      )}
      {creationStep === CharacterCreationSteps.selectMoves && character && character.name && character.playbook && (
        <CharacterMovesForm playbookType={character.playbook} characterName={character.name} />
      )}
    </Box>
  );
};

export default CharacterCreator;
