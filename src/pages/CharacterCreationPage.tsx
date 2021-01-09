import React, { FC, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Box, Layer, Paragraph } from 'grommet';

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
import { ButtonWS, HeadingWS } from '../config/grommetConfig';
import GAME, { GameData, GameVars } from '../queries/game';
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
import SET_BRAINER_GEAR, { SetBrainerGearData, SetBrainerGearVars } from '../mutations/setBrainerGear';
import SET_ANGEL_KIT, { SetAngelKitData, SetAngelKitVars } from '../mutations/setAngelKit';
import SET_CHARACTER_MOVES, { SetCharacterMovesData, SetCharacterMovesVars } from '../mutations/setCharacterMoves';
import SET_CUSTOM_WEAPONS, { SetCustomWeaponsData, SetCustomWeaponsVars } from '../mutations/setCustomWeapons';
import SET_CHARACTER_HX, { SetCharacterHxData, SetCharacterHxVars } from '../mutations/setCharacterHx';
import { PlayBooks, CharacterCreationSteps, LookCategories } from '../@types/enums';
import { HxInput } from '../@types';
import { Character, GameRole } from '../@types/dataInterfaces';
import { useKeycloakUser } from '../contexts/keycloakUserContext';

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

const CharacterCreationPage: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [creationStep, setCreationStep] = useState<number>(0);
  const [character, setCharacter] = useState<Character | undefined>();
  const [gameRole, setGameRole] = useState<GameRole | undefined>();
  const [showResetWarning, setShowResetWarning] = useState<PlayBooks | undefined>();
  const [showScrollable, setShowScrollable] = useState(false);

  // ------------------------------------------------------- Refs -------------------------------------------------------- //
  const containerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------- Context hooks ---------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: playbooksData } = useQuery<PlaybooksData>(PLAYBOOKS);
  const { data: gameData } = useQuery<GameData, GameVars>(GAME, { variables: { gameId } });
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
  const [setBrainerGear, { loading: settingBrainerGear }] = useMutation<SetBrainerGearData, SetBrainerGearVars>(
    SET_BRAINER_GEAR
  );
  const [setAngelKit, { loading: settingAngelKit }] = useMutation<SetAngelKitData, SetAngelKitVars>(SET_ANGEL_KIT);
  const [setCustomWeapons, { loading: settingCustomWeapons }] = useMutation<SetCustomWeaponsData, SetCustomWeaponsVars>(
    SET_CUSTOM_WEAPONS
  );
  const [setCharacterMoves, { loading: settingMoves }] = useMutation<SetCharacterMovesData, SetCharacterMovesVars>(
    SET_CHARACTER_MOVES
  );
  const [setCharacterHx, { loading: settingHx }] = useMutation<SetCharacterHxData, SetCharacterHxVars>(SET_CHARACTER_HX);

  const playbooks = playbooksData?.playbooks;
  const game = gameData?.game;
  const gameRoles = game?.gameRoles;
  gameRoles?.forEach((gr) => console.log('gr.characters', gr.characters));

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
            refetchQueries: [{ query: GAME, variables: { gameId } }],
          });
        } catch (error) {
          console.error(error);
        }
      } else if (gameRole.characters?.length === 1) {
        try {
          await setCharacterPlaybook({
            variables: { gameRoleId: gameRole.id, characterId: gameRole.characters[0].id, playbookType },
            refetchQueries: [{ query: GAME, variables: { gameId } }],
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
    if (!!gameRole && !!character) {
      try {
        await setCharacterName({
          variables: { gameRoleId: gameRole.id, characterId: character.id, name },
          refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevStep) => prevStep + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
          refetchQueries: [{ query: GAME, variables: { gameId } }],
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
    if (!!gameRole && !!character) {
      try {
        await setCharacterStats({
          variables: { gameRoleId: gameRole.id, characterId: character.id, statsOptionId },
          refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
          refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
          refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
          refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitCustomWeapons = async (weapons: string[]) => {
    if (!!gameRole && !!character) {
      try {
        await setCustomWeapons({
          variables: { gameRoleId: gameRole.id, characterId: character.id, weapons },
          refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitCharacterMoves = async (moveIds: string[]) => {
    if (!!gameRole && !!character) {
      try {
        await setCharacterMoves({
          variables: { gameRoleId: gameRole.id, characterId: character.id, moveIds },
          refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmitCharacterHx = async (hxInputs: HxInput[]) => {
    if (!!gameRole && !!character) {
      try {
        await setCharacterHx({
          variables: { gameRoleId: gameRole.id, characterId: character.id, hxStats: hxInputs },
          refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFinishCreation = () => history.push(`/player-game/${gameId}`);

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
  useEffect(() => {
    if (!!gameRoles && gameRoles.length > 0) {
      const gameRole = gameRoles.find((gameRole) => gameRole.userId === userId);
      setGameRole(gameRole);
      if (!!gameRole?.characters && gameRole.characters.length === 1) {
        setCharacter(gameRole.characters[0]);
      }
    }
  }, [gameRoles, userId]);

  // If page is loading but character is already partially created,
  // set creationStep to appropriate step
  useEffect(() => {
    if (character && creationStep === CharacterCreationSteps.intro) {
      if (!!character.playbook && !character.name) {
        setCreationStep(2);
      } else if (!!character.name && (!character.looks || character.looks.length < 5)) {
        setCreationStep(3);
      } else if (!!character.looks && character.looks.length >= 5 && character.statsBlock.length < 5) {
        setCreationStep(4);
      } else if (!!character.statsBlock && character.statsBlock.length === 5 && character.gear.length === 0) {
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
      <CloseButton handleClose={() => history.push('/menu')} />
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
            <HeadingWS level={4} alignSelf="start">
              Switch playbook?
            </HeadingWS>
            <Paragraph style={{ textShadow: '0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000' }}>
              Changing the playbook will reset the character.
            </Paragraph>
            <Box fill="horizontal" direction="row" justify="end" gap="small">
              <ButtonWS
                label="CANCEL"
                style={{
                  background: 'transparent',
                  textShadow: '0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000',
                }}
                onClick={() => setShowResetWarning(undefined)}
              />
              <ButtonWS label="SWITCH" primary onClick={() => handlePlaybookSelect(showResetWarning)} />
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
            settingStats={settingStats}
            playbookType={character?.playbook}
            handleSubmitStats={handleSubmitStats}
          />
        )}
        {creationStep === CharacterCreationSteps.selectGear && character && character.name && character.playbook && (
          <CharacterGearForm
            existingGear={character.gear}
            characterName={character.name}
            settingGear={settingGear}
            playbookType={character?.playbook}
            handleSubmitGear={handleSubmitGear}
          />
        )}
        {creationStep === CharacterCreationSteps.setUnique && character && character.name && character.playbook && (
          <PlaybookUniqueRouter
            playbookType={character.playbook}
            characterName={character.name}
            settingAngelKit={settingAngelKit}
            settingBrainerGear={settingBrainerGear}
            settingCustomWeapons={settingCustomWeapons}
            handleSubmitBrainerGear={handleSubmitBrainerGear}
            handleSubmitAngelKit={handleSubmitAngelKit}
            handleSubmitCustomWeapons={handleSubmitCustomWeapons}
            customWeapons={character.playbookUnique?.customWeapons}
          />
        )}
        {creationStep === CharacterCreationSteps.selectMoves && character && !!character.name && character.playbook && (
          <CharacterMovesForm
            playbookType={character.playbook}
            characterName={character.name}
            settingMoves={settingMoves}
            handleSubmitCharacterMoves={handleSubmitCharacterMoves}
          />
        )}
        {creationStep === CharacterCreationSteps.setHx && !!character && !!character.playbook && !!gameRoles && (
          <CharacterHxForm
            playbookType={character.playbook}
            character={character}
            gameRoles={gameRoles}
            settingHx={settingHx}
            handleSubmitCharacterHx={handleSubmitCharacterHx}
            handleFinishCreation={handleFinishCreation}
          />
        )}
      </Box>
    </Box>
  );
};

export default CharacterCreationPage;
