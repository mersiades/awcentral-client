import { useQuery } from '@apollo/client';
import { Box, Button, Form, Heading } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { PlaybookCreator, StatsOptions } from '../@types';
import { PlayBooks } from '../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';

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
          <Heading level={1}>{`WHAT ARE ${characterName}'s STRENGTHS AND WEAKNESSES?`}</Heading>
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
