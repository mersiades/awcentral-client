import { useQuery } from '@apollo/client';
import { Box, Button, Form, Heading } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { PlaybookCreator, StatsOptions } from '../@types';
import { PlayBooks } from '../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

interface CharacterStatsFormProps {
  playbookType: PlayBooks;
  handleSubmitStats: () => void;
  characterName: string;
  existingStats?: StatsOptions;
}

const CharacterStatsForm: FC<CharacterStatsFormProps> = ({
  playbookType,
  handleSubmitStats,
  characterName,
  existingStats,
}) => {
  const [value, setValue] = useState({ stats: '' });
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

  console.log('pbCreator', pbCreator);

  if (loadingPbCreator || !pbCreatorData || !pbCreator) {
    return (
      <Box fill background="black" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  console.log('pbCreator.statsOptions', pbCreator.statsOptions);

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
        onReset={() => setValue({ stats: '' })}
        onSubmit={({ value }: any) => handleSubmitStats()}
      >
        <Box width="50vw" height="50vh" align="center">
          <Heading level={1} textAlign="center">{`WHAT ARE ${characterName}'s STRENGTHS AND WEAKNESSES?`}</Heading>
          <Box fill margin={{ bottom: '48px' }}>
            {pbCreator.statsOptions.map((opt) => (
              <Box
                direction="row"
                justify="around"
                align="center"
                hoverIndicator={{ color: 'neutral-1', opacity: 0.3 }}
                onClick={() => console.log('clicked')}
                gap="6px"
              >
                <Box direction="row" align="center" gap="12px">
                  <Heading level={4}>COOL:</Heading>
                  <Heading color="brand" level={3}>
                    {opt.COOL}
                  </Heading>
                </Box>
                <Box direction="row" align="center" gap="12px">
                  <Heading level={4}>HARD:</Heading>
                  <Heading color="brand" level={3}>
                    {opt.HARD}
                  </Heading>
                </Box>
                <Box direction="row" align="center" gap="12px">
                  <Heading level={4}>HOT:</Heading>
                  <Heading color="brand" level={3}>
                    {opt.HOT}
                  </Heading>
                </Box>
                <Box direction="row" align="center" gap="12px">
                  <Heading level={4}>SHARP:</Heading>
                  <Heading color="brand" level={3}>
                    {opt.SHARP}
                  </Heading>
                </Box>
                <Box direction="row" align="center" gap="12px">
                  <Heading level={4}>WEIRD:</Heading>
                  <Heading color="brand" level={3}>
                    {opt.WEIRD}
                  </Heading>
                </Box>
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

export default CharacterStatsForm;
