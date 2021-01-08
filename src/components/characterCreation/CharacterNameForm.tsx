import React, { FC, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, TextInput, Text, Form, FormField } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import { PlayBooks } from '../../@types/enums';
import { PlaybookCreator } from '../../@types';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import { useFonts } from '../../contexts/fontContext';
import { decapitalize } from '../../helpers/decapitalize';

interface CharacterNameFormProps {
  playbookType: PlayBooks;
  settingName: boolean;
  handleSubmitName: (name: string) => void;
  existingName?: string;
}

const CharacterNameForm: FC<CharacterNameFormProps> = ({ playbookType, settingName, handleSubmitName, existingName }) => {
  const [pbCreator, setPbCreator] = useState<PlaybookCreator | undefined>();
  const [value, setValue] = useState({ characterName: existingName || '' });

  const { crustReady } = useFonts();

  const { data: pbCreatorData, loading: loadingPbCreator } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    {
      variables: { playbookType },
    }
  );

  useEffect(() => {
    !!pbCreatorData && setPbCreator(pbCreatorData.playbookCreator);
  }, [pbCreatorData]);

  if (loadingPbCreator || !pbCreatorData || !pbCreator) {
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
      background="transparent"
      pad="24px"
      align="center"
      justify="start"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Form
        value={value}
        onChange={(nextValue: any) => setValue(nextValue)}
        onReset={() => setValue({ characterName: '' })}
        onSubmit={({ value }: any) => handleSubmitName(value.characterName)}
      >
        <Box width="50vw" flex="grow" align="center">
          <HeadingWS crustReady={crustReady} level={2}>{`WHAT IS THE ${decapitalize(
            playbookType
          ).toUpperCase()} CALLED?`}</HeadingWS>
          <FormField name="characterName" width="100%">
            <TextInput placeholder="Type or select name" name="characterName" size="xxlarge" />
          </FormField>
          <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
            {pbCreator.names.map((name) => (
              <Box
                data-testid={`${name.name}-pill`}
                key={name.id}
                background="#4C684C"
                round="medium"
                pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
                margin={{ vertical: '3px', horizontal: '3px' }}
                justify="center"
                onClick={() => setValue({ characterName: name.name })}
                hoverIndicator={{ color: '#698D70', dark: true }}
              >
                <Text weight="bold" size="large">
                  {name.name}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
        <Box direction="row" justify="end" gap="12px" margin={{ top: '12px' }}>
          <ButtonWS type="reset" label="CLEAR" />
          <ButtonWS
            type="submit"
            primary
            label={settingName ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
          />
        </Box>
      </Form>
    </Box>
  );
};

export default CharacterNameForm;
