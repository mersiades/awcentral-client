import { useQuery } from '@apollo/client';
import { Box, FormField, TextInput } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Character, GameRole, HxInput } from '../@types';
import { PlayBooks, Roles } from '../@types/enums';
import { ButtonWS, HeadingWS, TextWS } from '../config/grommetConfig';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { formatPlaybookType } from '../helpers/formatPlaybookType';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin: unset;
  }
`;

interface CharacterHxFormProps {
  playbookType: PlayBooks;
  character: Character;
  gameRoles?: GameRole[];
  handleSubmitCharacterHx: (hxInputs: HxInput[]) => void;
  handleFinishCreation: () => void;
}

const CharacterHxForm: FC<CharacterHxFormProps> = ({
  playbookType,
  character,
  gameRoles,
  handleSubmitCharacterHx,
  handleFinishCreation,
}) => {
  const [value, setValue] = useState<HxInput[]>([]);
  const [hasSet, setHasSet] = useState(false);

  // -------------------------------------------------- Context hooks ---------------------------------------------------- //
  const { id: userId } = useKeycloakUser();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: pbCreatorData, loading: loadingPbCreator } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    {
      variables: { playbookType },
    }
  );

  const hxInstructions = pbCreatorData?.playbookCreator.hxInstructions;

  let characters: Character[] = [];
  gameRoles?.forEach((gameRole) => {
    if (gameRole.role === Roles.player && gameRole.userId !== userId) {
      if (!!gameRole.characters && gameRole.characters.length === 1) characters = [...characters, gameRole.characters[0]];
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
      <Box fill justify="center" align="center">
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
      <Box width="60vw" flex="grow">
        <HeadingWS
          level={2}
          textAlign="center"
          style={{ maxWidth: 'unset' }}
        >{`WHAT HISTORY DOES ${character.name?.toUpperCase()} HAVE?`}</HeadingWS>
        <Box direction="row" wrap justify="around">
          {characters.map((char) => {
            const looks = char.looks?.map((look) => look.look);
            const existingValue = character.hxBlock.find((hxStat) => hxStat.characterId === char.id)?.hxValue;
            return (
              !!char.name && (
                <Box
                  key={char.id}
                  border={{ color: 'brand', size: 'small' }}
                  style={{
                    boxShadow: `0 0 5px 1px rgba(0, 0, 0, 0.3),
                      0 0 10px 1px rgba(0, 0, 0, 0.2),
                      0 0 5px 1px rgba(0, 0, 0, 0.3) inset,
                      0 0 10px 1px rgba(0, 0, 0, 0.2) inset
                      `,
                  }}
                  direction="row"
                  width="350px"
                  margin={{ right: '12px', bottom: '12px' }}
                >
                  <Box width="250px" pad="12px">
                    <HeadingWS level={3} style={{ marginTop: '6px', marginBottom: '6px' }}>
                      {char.name}
                    </HeadingWS>
                    {!!char.playbook && (
                      <TextWS weight="bold" size="medium">
                        {formatPlaybookType(char.playbook)}
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
                </Box>
              )
            );
          })}
        </Box>
        <Box pad="6px" overflow={{ vertical: 'auto' }}>
          <StyledMarkdown>{hxInstructions}</StyledMarkdown>
        </Box>

        <Box direction="row" justify="end" gap="24px" margin={{ vertical: '12px' }}>
          <ButtonWS
            primary={!hasSet}
            secondary={hasSet}
            label="SET"
            style={{ minHeight: '52px' }}
            disabled={value.length === 0}
            onClick={() => filterSubmit(value)}
          />
          {hasSet && (
            <ButtonWS
              primary
              label="GO TO GAME"
              style={{ minHeight: '52px' }}
              disabled={value.length === 0}
              onClick={() => handleFinishCreation()}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterHxForm;