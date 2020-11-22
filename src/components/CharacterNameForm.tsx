import React, { FC, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Heading, TextInput, Text, Button, Form, FormField } from 'grommet';

import Spinner from './Spinner';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import { PlaybookCreator } from '../@types';
import { PlayBooks } from '../@types/enums';

interface CharacterNameFormProps {
  playbookType: PlayBooks;
}

interface NameFormValues {
  name: string;
}

const CharacterNameForm: FC<CharacterNameFormProps> = ({ playbookType }) => {
  const [pbCreator, setPbCreator] = useState<PlaybookCreator | undefined>();
  const [value, setValue] = useState({ characterName: '' });
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
      <Box fill background="black" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      fill
      direction="column"
      background="black"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      pad="24px"
      align="center"
      justify="center"
    >
      <Form
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        onReset={() => setValue({ characterName: '' })}
        onSubmit={({ value }: any) => console.log(`submitted ${value.characterName}`)}
      >
        <Box width="50vw" height="50vh" align="center">
          <Heading level={1}>SET CHARACTER NAME</Heading>
          <FormField name="characterName" width="100%">
            <TextInput placeholder="Type or select name" name="characterName" size="xxlarge" />
          </FormField>
          <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
            {pbCreator.names.map((name) => (
              <Box
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
        <Box direction="row" justify="end" gap="24px">
          <Button type="reset" label="CLEAR" />
          <Button type="submit" primary label="SET" />
        </Box>
      </Form>
    </Box>
  );
};

export default CharacterNameForm;
