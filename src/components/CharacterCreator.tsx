import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Box } from 'grommet';

import PlaybooksSelector from './PlaybooksSelector';
import CharacterNameForm from './CharacterNameForm';
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
import USER_BY_DISCORD_ID, { UserByDiscordIdData, UserByDiscordIdVars } from '../queries/userByDiscordId';
import { AWCENTRAL_GUILD_ID } from '../config/discordConfig';
import { useDiscordUser } from '../contexts/discordUserContext';
import { CharacterCreationSteps, PlayBooks } from '../@types/enums';
import { Character, GameRole } from '../@types';

interface CharacterCreatorProps {}

const CharacterCreator: FC<CharacterCreatorProps> = () => {
  /**
   * Step 0 = Choose a playbook
   */
  const [creationStep, setCreationStep] = useState<number>(0);
  const [character, setCharacter] = useState<Character | undefined>();
  const { discordId } = useDiscordUser();
  const [gameRole, setGameRole] = useState<GameRole | undefined>();
  const { data: userData, loading: loadingUser } = useQuery<UserByDiscordIdData, UserByDiscordIdVars>(USER_BY_DISCORD_ID, {
    variables: { discordId },
    skip: !discordId,
  });

  const userId = userData?.userByDiscordId.id;
  const { gameID: textChannelId } = useParams<{ gameID: string }>();

  const { data: playbooksData, loading: loadingPlaybooks } = useQuery<PlaybooksData>(PLAYBOOKS);
  const { data: gameData, loading: loadingGame } = useQuery<GameForPlayerData, GameForPlayerVars>(GAME_FOR_PLAYER, {
    // @ts-ignore
    variables: { textChannelId, userId },
  });
  const [createCharacter] = useMutation<CreateCharacterData, CreateCharacterVars>(CREATE_CHARACTER);
  const [setCharacterPlaybook] = useMutation<SetCharacterPlaybookData, SetCharacterPlaybookVars>(SET_CHARACTER_PLAYBOOK);

  const playbooks = playbooksData?.playbooks;
  const game = gameData?.gameForPlayer;
  const gameRoles = game?.gameRoles;

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
          refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { textChannelId, userId } }],
        });
      } catch (error) {
        console.error(error);
      }

      setCreationStep((prevState) => prevState + 1);
    }
  };

  const closeNewGameIntro = () => setCreationStep((prevState) => prevState + 1);

  // ------------------------------------------------ Render -------------------------------------------------- //

  useEffect(() => {
    if (!!gameRoles && gameRoles.length > 0) {
      setGameRole(gameRoles[0]);
      if (!!gameRoles[0].characters && gameRoles[0].characters.length === 1) {
        setCharacter(gameRoles[0].characters[0]);
      }
    }
  }, [gameRoles]);

  useEffect(() => {
    if (character) {
      if (creationStep === 0 && !!character.playbook && !character.name) {
        setCreationStep(2);
      }
    }
  }, [character, creationStep]);

  if (loadingPlaybooks || loadingUser || loadingGame || !playbooks || !game) {
    return (
      <Box fill background="black" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }
  console.log('character', character);

  return (
    <Box fill background="black">
      <CharacterCreationStepper character={character} currentStep={creationStep} setCreationStep={setCreationStep} />
      {creationStep === CharacterCreationSteps.intro && (
        <NewGameIntro
          gameName={game.name}
          voiceChannelUrl={`https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game.textChannelId}`}
          closeNewGameIntro={closeNewGameIntro}
        />
      )}
      {creationStep === CharacterCreationSteps.selectPlaybook && (
        <PlaybooksSelector
          playbooks={playbooks}
          playbook={character?.playbook}
          handlePlaybookSelect={handlePlaybookSelect}
        />
      )}
      {creationStep === CharacterCreationSteps.selectName && character && character.playbook && (
        <CharacterNameForm playbookType={character?.playbook} />
      )}
    </Box>
  );
};

export default CharacterCreator;
