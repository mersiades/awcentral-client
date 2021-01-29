import React, { FC, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import SET_CHARACTER_STATS, { SetCharacterStatsData, SetCharacterStatsVars } from '../../mutations/setCharacterStats';
import { CharacterCreationSteps } from '../../@types/enums';
import { StatsOption } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

const CharacterStatsForm: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const existingStatsOptionId = character?.statsBlock?.statsOptionId;
  const [selectedStatsOption, setSelectedStatsOption] = useState<StatsOption | undefined>();

  // --------------------------------------------------3rd party hooks ----------------------------------------------------- //
  const history = useHistory();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    // @ts-ignore
    { variables: { playbookType: character?.playbook }, skip: !character?.playbook }
  );
  const statsOptions = pbCreatorData?.playbookCreator.statsOptions;
  const [setCharacterStats, { loading: settingStats }] = useMutation<SetCharacterStatsData, SetCharacterStatsVars>(
    SET_CHARACTER_STATS
  );

  // ---------------------------------------- Component functions and variables ------------------------------------------ //
  const handleSubmitStats = async (statsOptionId: string) => {
    if (!!userGameRole && !!character && !!game) {
      try {
        await setCharacterStats({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, statsOptionId },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectGear}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // -------------------------------------------------- Render component  ---------------------------------------------------- //
  return (
    <Box
      fill
      direction="column"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      pad="24px"
      align="center"
      justify="start"
    >
      <Box width="50vw" flex="grow">
        <HeadingWS level={2} crustReady={crustReady} textAlign="center">{`WHAT ARE ${
          !!character?.name ? character.name.toUpperCase() : '...'
        }'S STRENGTHS AND WEAKNESSES?`}</HeadingWS>
        <HeadingWS level={4} textAlign="start">
          Choose a set:
        </HeadingWS>
        <Box fill margin={{ bottom: '48px' }}>
          {!!statsOptions &&
            statsOptions.map((opt) => (
              <Box
                data-testid={`${opt.id}-stats-option-box`}
                key={opt.id}
                direction="row"
                justify="around"
                align="center"
                border={opt.id === existingStatsOptionId}
                background={{ color: 'neutral-1', opacity: opt.id === existingStatsOptionId ? 0.5 : 0 }}
                hoverIndicator={{ color: 'neutral-1', opacity: 0.4 }}
                onClick={() => setSelectedStatsOption(opt)}
                gap="6px"
                style={{ minHeight: '52px' }}
              >
                <Box direction="row" align="center" gap="12px">
                  <HeadingWS level={4}>COOL:</HeadingWS>
                  <HeadingWS crustReady={crustReady} color="brand" level={3}>
                    {opt.COOL}
                  </HeadingWS>
                </Box>
                <Box direction="row" align="center" gap="12px">
                  <HeadingWS level={4}>HARD:</HeadingWS>
                  <HeadingWS crustReady={crustReady} color="brand" level={3}>
                    {opt.HARD}
                  </HeadingWS>
                </Box>
                <Box direction="row" align="center" gap="12px">
                  <HeadingWS level={4}>HOT:</HeadingWS>
                  <HeadingWS crustReady={crustReady} color="brand" level={3}>
                    {opt.HOT}
                  </HeadingWS>
                </Box>
                <Box direction="row" align="center" gap="12px">
                  <HeadingWS level={4}>SHARP:</HeadingWS>
                  <HeadingWS crustReady={crustReady} color="brand" level={3}>
                    {opt.SHARP}
                  </HeadingWS>
                </Box>
                <Box direction="row" align="center" gap="12px">
                  <HeadingWS level={4}>WEIRD:</HeadingWS>
                  <HeadingWS crustReady={crustReady} color="brand" level={3}>
                    {opt.WEIRD}
                  </HeadingWS>
                </Box>
              </Box>
            ))}
          <Box direction="row" justify="end" width="50vw" margin={{ top: '12px' }}>
            <ButtonWS
              primary
              label={settingStats ? <Spinner fillColor="#FFF" /> : 'SET'}
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
