import { useQuery } from '@apollo/client';
import { Box, Grid, Heading, Text, TextInput } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
// import styled from 'styled-components';
import { PlaybookCreator } from '../@types';
import { PlayBooks } from '../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

interface PlaybookBasicFormProps {
  playbookType: PlayBooks;
}

// const NameChip = styled.div`
//   background-color:
// `

const PlaybookBasicForm: FC<PlaybookBasicFormProps> = ({ playbookType }) => {
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
  console.log('pbCreator', pbCreator);
  return (
    <Box
      fill
      direction="column"
      background="black"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      margin="24px"
    >
      <Grid
        fill
        rows={['1/3', '1/3', '1/3']}
        columns={['1/2', '1/2']}
        areas={[{ name: 'names', start: [0, 0], end: [0, 0] }]}
      >
        <Box gridArea="names" border="all" fill pad="24px">
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
      </Grid>
    </Box>
  );
};

export default PlaybookBasicForm;
