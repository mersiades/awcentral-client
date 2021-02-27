import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Box, FormField, TextInput } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS, RedBox, TextWS } from '../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import SET_CHARACTER_HX, { SetCharacterHxData, SetCharacterHxVars } from '../../mutations/setCharacterHx';
import TOGGLE_STAT_HIGHLIGHT, {
  ToggleStatHighlightData,
  ToggleStatHighlightVars,
} from '../../mutations/toggleStatHighlight';
import FINISH_CHARACTER_CREATION, {
  FinishCharacterCreationData,
  FinishCharacterCreationVars,
} from '../../mutations/finishCharacterCreation';
import { StatType } from '../../@types/enums';
import { HxInput } from '../../@types';
import { Character } from '../../@types/dataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import StatsBox from '../playbookPanel/StatsBox';
import { decapitalize } from '../../helpers/decapitalize';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin-top: 6px;
    margin-bottom: 6px;
    margin-left: 0px;
    margin-right: 0px;
  }
`;

const CharacterHxForm: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [value, setValue] = useState<HxInput[]>([]);
  const [hasSet, setHasSet] = useState(false);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole, otherPlayerGameRoles } = useGame();
  const { crustReady } = useFonts();

  // --------------------------------------------------3rd party hooks ----------------------------------------------------- //
  const history = useHistory();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    // @ts-ignore
    { variables: { playbookType: character?.playbook }, skip: !character?.playbook }
  );
  const hxInstructions = pbCreatorData?.playbookCreator.hxInstructions;
  const [toggleStatHighlight, { loading: togglingHighlight }] = useMutation<
    ToggleStatHighlightData,
    ToggleStatHighlightVars
  >(TOGGLE_STAT_HIGHLIGHT);
  const [setCharacterHx, { loading: settingHx }] = useMutation<SetCharacterHxData, SetCharacterHxVars>(SET_CHARACTER_HX);
  const [finishCharacterCreation, { loading: finishingCreation }] = useMutation<
    FinishCharacterCreationData,
    FinishCharacterCreationVars
  >(FINISH_CHARACTER_CREATION);

  // ------------------------------------------ Component functions and variables ------------------------------------------ //
  let characters: Character[] = [];
  otherPlayerGameRoles?.forEach((gameRole) => {
    if (!!gameRole.characters && gameRole.characters.length === 1) {
      characters = [...characters, gameRole.characters[0]];
    }
  });

  const handleToggleHighlight = async (stat: StatType) => {
    if (!!userGameRole && !!character) {
      try {
        await toggleStatHighlight({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, stat },
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
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFinishCreation = async () => {
    if (!!userGameRole && !!character && !!game) {
      try {
        await finishCharacterCreation({
          variables: { gameRoleId: userGameRole.id, characterId: character.id },
        });
        history.push(`/pre-game/${game.id}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const filterSubmit = (hxInputs: HxInput[]) => {
    characters.forEach((char) => {
      const input = hxInputs.find((inp) => inp.characterId === char.id);
      if (!input && !!char.name) {
        hxInputs = [...hxInputs, { characterId: char.id, characterName: char.name, hxValue: 0 }];
      }
    });
    handleSubmitCharacterHx(hxInputs);
    setHasSet(true);
  };

  console.log('value', value);
  console.log('character?.statsBlock', character?.statsBlock);

  // Loads any existing HxStats into component state
  // Bug: initialValue is being reset to `[]` when the toggleHighlight mutation returns
  useEffect(() => {
    let initialValue: HxInput[] = [];
    !!character?.hxBlock &&
      character.hxBlock.forEach(({ characterId, characterName, hxValue }) => {
        initialValue = [...initialValue, { characterId, characterName, hxValue }];
      });
    setValue(initialValue);
  }, [character, setValue]);

  return (
    <Box
      data-testid="character-hx-form"
      fill
      direction="column"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      align="center"
      justify="start"
    >
      <Box width="60vw" flex="grow" align="center">
        <HeadingWS level={2} crustReady={crustReady} textAlign="center" style={{ maxWidth: 'unset' }}>{`WHAT HISTORY DOES ${
          !!character?.name ? character.name.toUpperCase() : '...'
        } HAVE?`}</HeadingWS>
        <Box direction="row" wrap justify="around">
          {characters.map((char) => {
            const looks = char.looks?.map((look) => look.look);
            const existingValue = character?.hxBlock.find((hxStat) => hxStat.characterId === char.id)?.hxValue;
            return (
              !!char.name && (
                <RedBox
                  data-testid={`${char.name}-hx-box`}
                  key={char.id}
                  direction="row"
                  width="350px"
                  margin={{ right: '12px', bottom: '12px' }}
                >
                  <Box width="250px" pad="12px">
                    <HeadingWS crustReady={crustReady} level={3} style={{ marginTop: '6px', marginBottom: '6px' }}>
                      {char.name}
                    </HeadingWS>
                    {!!char.playbook && (
                      <TextWS weight="bold" size="medium">
                        {decapitalize(char.playbook)}
                      </TextWS>
                    )}
                    {!!looks && <TextWS size="small">{looks.join(', ')}</TextWS>}
                  </Box>
                  <Box pad="12px" fill="vertical" justify="center" width="100px">
                    <FormField name={char.id} label="Hx">
                      <TextInput
                        name={char.id}
                        type="number"
                        size="xlarge"
                        textAlign="center"
                        defaultValue={existingValue || 0}
                        onChange={(e) => {
                          const existingInput = value.find((hxInput) => hxInput.characterId === char.id);
                          if (!!existingInput) {
                            const index = value.indexOf(existingInput);
                            value.splice(index, 1);
                          }
                          !!char.name &&
                            setValue([
                              ...value,
                              {
                                characterId: char.id,
                                characterName: char.name,
                                hxValue: parseInt(e.target.value),
                              },
                            ]);
                        }}
                      />
                    </FormField>
                  </Box>
                </RedBox>
              )
            );
          })}
        </Box>
        <Box pad="6px" style={{ maxWidth: '812px' }}>
          <StyledMarkdown>{hxInstructions}</StyledMarkdown>
        </Box>
        {!!character?.statsBlock && (
          <StatsBox
            stats={character.statsBlock.stats}
            togglingHighlight={togglingHighlight}
            handleToggleHighlight={handleToggleHighlight}
          />
        )}

        <Box fill="horizontal" direction="row" justify="end" gap="12px" margin={{ vertical: '12px' }}>
          <ButtonWS
            primary={!hasSet}
            secondary={hasSet}
            label={settingHx ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
            style={{ minHeight: '52px' }}
            disabled={value.length === 0}
            onClick={() => !settingHx && filterSubmit(value)}
          />
          {hasSet && (
            <ButtonWS
              primary
              label={finishingCreation ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'GO TO GAME'}
              style={{ minHeight: '52px' }}
              disabled={value.length === 0}
              onClick={() => !finishingCreation && handleFinishCreation()}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterHxForm;
