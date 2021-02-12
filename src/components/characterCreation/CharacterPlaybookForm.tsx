import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Box } from 'grommet';

import Spinner from '../Spinner';
import WarningDialog from '../dialogs/WarningDialog';
import { ButtonWS, HeadingWS, ParagraphWS } from '../../config/grommetConfig';
import { StyledMarkdown } from '../styledComponents';
import PLAYBOOKS, { PlaybooksData } from '../../queries/playbooks';
import CREATE_CHARACTER, { CreateCharacterData, CreateCharacterVars } from '../../mutations/createCharacter';
import SET_CHARACTER_PLAYBOOK, {
  SetCharacterPlaybookData,
  SetCharacterPlaybookVars,
} from '../../mutations/setCharacterPlaybook';
import { CharacterCreationSteps, PlaybookType } from '../../@types/enums';
import { Playbook } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';
import '../../assets/styles/transitions.css';
import { useHistory } from 'react-router-dom';

const CharacterPlaybookForm: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | undefined>();
  const [showIntro, setShowIntro] = useState(true);
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [sortedPlaybooks, setSortedPlaybooks] = useState<Playbook[]>([]);
  const [showResetWarning, setShowResetWarning] = useState<PlaybookType | undefined>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // --------------------------------------------------3rd party hooks ----------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: playbooksData } = useQuery<PlaybooksData>(PLAYBOOKS);
  const playbooks = playbooksData?.playbooks;
  const [createCharacter, { loading: creatingCharacter }] = useMutation<CreateCharacterData, CreateCharacterVars>(
    CREATE_CHARACTER
  );
  const [setCharacterPlaybook, { loading: settingPlaybook }] = useMutation<
    SetCharacterPlaybookData,
    SetCharacterPlaybookVars
  >(SET_CHARACTER_PLAYBOOK);

  // ---------------------------------------- Component functions and variables ------------------------------------------ //
  const handlePlaybookClick = (playbook: Playbook) => {
    setShowIntro(false);
    setSelectedPlaybook(undefined);
    setTimeout(() => setSelectedPlaybook(playbook), 0);
  };

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
    if (!!userGameRole && !!game) {
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
          });
        } catch (error) {
          console.error(error);
        }
      } else if (userGameRole.characters?.length === 1) {
        try {
          await setCharacterPlaybook({
            variables: { gameRoleId: userGameRole.id, characterId: userGameRole.characters[0].id, playbookType },
          });
        } catch (error) {
          console.error(error);
        }
      }
      setShowResetWarning(undefined);
      history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectName}`);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!!playbooks) {
      const sortedPlaybooks = [...playbooks].sort((a, b) => {
        const nameA = a.playbookType.toLowerCase();
        const nameB = b.playbookType.toLowerCase();
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });
      setSortedPlaybooks(sortedPlaybooks);
    }
  }, [playbooks]);

  // If the playbook has already been set, show that playbook to the User
  useEffect(() => {
    if (!!character && !!character.playbook && playbooks) {
      const setPlaybook = playbooks.filter((pb) => pb.playbookType === character.playbook)[0];
      setSelectedPlaybook(setPlaybook);
    }
  }, [character, playbooks]);

  return (
    <Box
      fill
      direction="column"
      background="transparent"
      align="center"
      justify="between"
      className={startFadeOut ? 'fadeOut' : ''}
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      {!!showResetWarning && (
        <WarningDialog
          title="Switch playbook?"
          buttonTitle="SWITCH"
          text="Changing the playbook will reset the character."
          handleClose={() => setShowResetWarning(undefined)}
          handleConfirm={() => handlePlaybookSelect(showResetWarning)}
        />
      )}
      {!selectedPlaybook && showIntro && (
        <Box>
          <HeadingWS crustReady={crustReady} level={2}>
            Choose your playbook
          </HeadingWS>
          <ParagraphWS>
            You should probably wait for your MC and the rest of your crew, tho. No headstarts for nobody in Apocalypse
            World.
          </ParagraphWS>
        </Box>
      )}
      {!!selectedPlaybook && (
        <Box direction="row" fill="horizontal" margin={{ bottom: '125px' }} justify="center">
          <Box animation="fadeIn" justify="center">
            <img
              src={selectedPlaybook.playbookImageUrl}
              alt={decapitalize(selectedPlaybook.playbookType)}
              style={{ objectFit: 'contain', maxHeight: '45vh' }}
            />
          </Box>
          <Box pad="12px" animation="fadeIn" justify="around" align="center">
            <HeadingWS crustReady={crustReady} level={2} alignSelf="center" margin="0px">
              {decapitalize(selectedPlaybook.playbookType)}
            </HeadingWS>
            <Box overflow="auto" style={{ maxWidth: '856px', maxHeight: '30vh' }}>
              <StyledMarkdown>{selectedPlaybook.intro}</StyledMarkdown>
              <em>
                <StyledMarkdown>{selectedPlaybook.introComment}</StyledMarkdown>
              </em>
            </Box>

            {[
              PlaybookType.angel,
              PlaybookType.battlebabe,
              PlaybookType.brainer,
              PlaybookType.driver,
              PlaybookType.chopper,
              PlaybookType.gunlugger,
              PlaybookType.hardholder,
              PlaybookType.hocus,
            ].includes(selectedPlaybook.playbookType) && (
              <ButtonWS
                label={
                  settingPlaybook || creatingCharacter ? (
                    <Spinner fillColor="#FFF" width="200px" height="36px" />
                  ) : (
                    `SELECT ${decapitalize(selectedPlaybook.playbookType)}`
                  )
                }
                primary
                size="large"
                onClick={() => {
                  setStartFadeOut(true);
                  checkPlaybookReset(selectedPlaybook.playbookType);
                }}
                margin="12px"
              />
            )}
          </Box>
        </Box>
      )}

      <Box
        direction="row"
        gap="3px"
        pad="3px"
        align="end"
        justify="around"
        style={{ height: '125px', position: 'absolute', left: 0, bottom: 0, right: 0, top: 'unset' }}
      >
        {sortedPlaybooks.length > 0
          ? sortedPlaybooks.map((playbook) => (
              <Box
                data-testid={`${playbook.playbookType.toLowerCase()}-button`}
                key={playbook.playbookImageUrl}
                onClick={() => handlePlaybookClick(playbook)}
                hoverIndicator={{ color: 'brand', opacity: 0.4 }}
                height="95%"
                justify="center"
                align="center"
              >
                <img
                  src={playbook.playbookImageUrl}
                  alt={decapitalize(playbook.playbookType)}
                  style={{ objectFit: 'contain', maxHeight: '98%', maxWidth: '96%' }}
                />
              </Box>
            ))
          : null}
      </Box>
    </Box>
  );
};

export default CharacterPlaybookForm;
