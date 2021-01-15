import React, { FC, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Box, FormField, TextInput } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS, RedBox, TextWS } from '../../config/grommetConfig';
import { PlayBooks, Stats } from '../../@types/enums';
import { HxInput } from '../../@types';
import { Character } from '../../@types/dataInterfaces';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import { useFonts } from '../../contexts/fontContext';
import { decapitalize } from '../../helpers/decapitalize';
import { useGame } from '../../contexts/gameContext';
import StatsBox from '../characterSheet/StatsBox';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin: unset;
  }
`;

interface CharacterHxFormProps {
  playbookType: PlayBooks;
  character: Character;
  settingHx: boolean;
  togglingHighlight: boolean;
  finishingCreation: boolean;
  handleToggleHighlight: (stat: Stats) => void;
  handleSubmitCharacterHx: (hxInputs: HxInput[]) => void;
  handleFinishCreation: () => void;
}

const CharacterHxForm: FC<CharacterHxFormProps> = ({
  playbookType,
  character,
  settingHx,
  togglingHighlight,
  finishingCreation,
  handleToggleHighlight,
  handleSubmitCharacterHx,
  handleFinishCreation,
}) => {
  const [value, setValue] = useState<HxInput[]>([]);
  const [hasSet, setHasSet] = useState(false);

  // -------------------------------------------------- Context hooks ---------------------------------------------------- //
  const { crustReady } = useFonts();
  const { otherPlayerGameRoles } = useGame();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: pbCreatorData, loading: loadingPbCreator } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    {
      variables: { playbookType },
    }
  );

  const hxInstructions = pbCreatorData?.playbookCreator.hxInstructions;

  let characters: Character[] = [];
  otherPlayerGameRoles?.forEach((gameRole) => {
    if (!!gameRole.characters && gameRole.characters.length === 1) {
      characters = [...characters, gameRole.characters[0]];
    }
  });

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

  // Loads any existing HxStats into component state
  useEffect(() => {
    let initialValue: HxInput[] = [];
    !!character.hxBlock &&
      character.hxBlock.forEach(({ characterId, characterName, hxValue }) => {
        initialValue = [...initialValue, { characterId, characterName, hxValue }];
      });
    setValue(initialValue);
  }, [character, setValue]);

  if (loadingPbCreator || !hxInstructions) {
    return (
      <Box fill background="transparent" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      fill
      direction="column"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      align="center"
      justify="start"
    >
      <Box width="60vw" flex="grow" align="center">
        <HeadingWS
          level={2}
          crustReady={crustReady}
          textAlign="center"
          style={{ maxWidth: 'unset' }}
        >{`WHAT HISTORY DOES ${character.name?.toUpperCase()} HAVE?`}</HeadingWS>
        <Box direction="row" wrap justify="around">
          {characters.map((char) => {
            const looks = char.looks?.map((look) => look.look);
            const existingValue = character.hxBlock.find((hxStat) => hxStat.characterId === char.id)?.hxValue;
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
        {!!character.statsBlock && (
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
