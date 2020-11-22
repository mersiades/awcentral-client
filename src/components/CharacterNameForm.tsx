import React, { FC, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Heading, TextInput, Text } from 'grommet';

import Spinner from './Spinner';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import { PlaybookCreator } from '../@types';
import { PlayBooks } from '../@types/enums';

interface CharacterNameFormProps {
  playbookType: PlayBooks;
}

const CharacterNameForm: FC<CharacterNameFormProps> = ({ playbookType }) => {
  const [pbCreator, setPbCreator] = useState<PlaybookCreator | undefined>();
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
      <Box width="large" border height="large">
        <Heading level={3}>NAME</Heading>
        <TextInput placeholder="Type or select name" />
        <Box direction="row" margin={{ top: '3px' }} wrap>
          {pbCreator.names.map((name) => (
            <Box
              key={name.id}
              background="#4C684C"
              round="medium"
              pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
              margin={{ vertical: '3px', horizontal: '3px' }}
              justify="center"
              onClick={() => console.log(name.name)}
              hoverIndicator={{ color: '#698D70' }}
            >
              <Text weight="bold">{name.name}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterNameForm;
