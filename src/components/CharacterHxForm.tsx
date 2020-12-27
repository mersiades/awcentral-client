import { useQuery } from '@apollo/client';
import { Box, FormField, Text, TextInput } from 'grommet';
import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Character, GameRole, HxInput } from '../@types';
import { PlayBooks, Roles } from '../@types/enums';
import { accentColors, ButtonWS, HeadingWS } from '../config/grommetConfig';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { formatPlaybookType } from '../helpers/formatPlaybookType';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin: unset;
    color: ${accentColors[0]};
  }
`;

interface CharacterHxFormProps {
  playbookType: PlayBooks;
  characterName: string;
  gameRoles?: GameRole[];
  handleSubmitCharacterHx: (hxInputs: HxInput[]) => void;
  handleFinishCreation: () => void;
}

const CharacterHxForm: FC<CharacterHxFormProps> = ({
  playbookType,
  characterName,
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
      if (!input) {
        hxInputs = [...hxInputs, { characterId: char.id, hxValue: 0 }];
      }
    });
    handleSubmitCharacterHx(hxInputs);
    setHasSet(true);
  };

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
      <Box width="60vw">
        <HeadingWS
          level={2}
          textAlign="center"
          style={{ maxWidth: 'unset' }}
        >{`WHAT HISTORY DOES ${characterName.toUpperCase()} HAVE?`}</HeadingWS>
        <Box direction="row" wrap justify="around">
          {characters.map((character) => {
            const looks = character.looks?.map((look) => look.look);
            return (
              <Box key={character.id} border={{ color: 'brand' }} direction="row" width="350px" margin={{ right: '12px' }}>
                <Box width="250px" pad="12px">
                  <HeadingWS level={3} style={{ marginTop: '6px', marginBottom: '6px' }}>
                    {character.name}
                  </HeadingWS>
                  {!!character.playbook && (
                    <Text weight="bold" size="medium">
                      {formatPlaybookType(character.playbook)}
                    </Text>
                  )}
                  {!!looks && <Text size="small">{looks.join(', ')}</Text>}
                </Box>
                <Box pad="12px" fill="vertical" justify="center" width="100px">
                  <FormField name={character.id} label="Hx">
                    <TextInput
                      name={character.id}
                      type="number"
                      size="xlarge"
                      textAlign="center"
                      defaultValue={0}
                      onChange={(e) => {
                        const existingInput = value.find((hxInput) => hxInput.characterId === character.id);
                        if (!!existingInput) {
                          const index = value.indexOf(existingInput);
                          value.splice(index, 1);
                        }
                        setValue([...value, { characterId: character.id, hxValue: parseInt(e.target.value) }]);
                      }}
                    />
                  </FormField>
                </Box>
              </Box>
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
