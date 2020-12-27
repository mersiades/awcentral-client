import { useQuery } from '@apollo/client';
import { Box } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { PlaybookCreator, StatsOption } from '../@types';
import { PlayBooks } from '../@types/enums';
import { ButtonWS, HeadingWS } from '../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

interface CharacterStatsFormProps {
  playbookType: PlayBooks;
  handleSubmitStats: (statsOptionId: string) => void;
  characterName: string;
}

const CharacterStatsForm: FC<CharacterStatsFormProps> = ({ playbookType, handleSubmitStats, characterName }) => {
  const [selectedStatsOption, setSelectedStatsOption] = useState<StatsOption | undefined>();
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
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      pad="24px"
      align="center"
      justify="start"
    >
      <Box width="50vw" height="50vh">
        <HeadingWS
          level={2}
          textAlign="center"
        >{`WHAT ARE ${characterName.toUpperCase()}'S STRENGTHS AND WEAKNESSES?`}</HeadingWS>
        <HeadingWS level={4} textAlign="start">
          Choose a set:
        </HeadingWS>
        <Box fill margin={{ bottom: '48px' }}>
          {pbCreator.statsOptions.map((opt) => (
            <Box
              key={opt.id}
              direction="row"
              justify="around"
              align="center"
              hoverIndicator={{ color: 'neutral-1', opacity: 0.4 }}
              onClick={() => setSelectedStatsOption(opt)}
              gap="6px"
              style={{ minHeight: '52px' }}
            >
              <Box direction="row" align="center" gap="12px">
                <HeadingWS level={4}>COOL:</HeadingWS>
                <HeadingWS color="brand" level={3}>
                  {opt.COOL}
                </HeadingWS>
              </Box>
              <Box direction="row" align="center" gap="12px">
                <HeadingWS level={4}>HARD:</HeadingWS>
                <HeadingWS color="brand" level={3}>
                  {opt.HARD}
                </HeadingWS>
              </Box>
              <Box direction="row" align="center" gap="12px">
                <HeadingWS level={4}>HOT:</HeadingWS>
                <HeadingWS color="brand" level={3}>
                  {opt.HOT}
                </HeadingWS>
              </Box>
              <Box direction="row" align="center" gap="12px">
                <HeadingWS level={4}>SHARP:</HeadingWS>
                <HeadingWS color="brand" level={3}>
                  {opt.SHARP}
                </HeadingWS>
              </Box>
              <Box direction="row" align="center" gap="12px">
                <HeadingWS level={4}>WEIRD:</HeadingWS>
                <HeadingWS color="brand" level={3}>
                  {opt.WEIRD}
                </HeadingWS>
              </Box>
            </Box>
          ))}
          <Box direction="row" justify="end" width="50vw" margin={{ top: '12px' }}>
            <ButtonWS
              primary
              label="SET"
              onClick={() => !!selectedStatsOption && handleSubmitStats(selectedStatsOption.id)}
              disabled={!selectedStatsOption}
              style={{ minHeight: '52px' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterStatsForm;
