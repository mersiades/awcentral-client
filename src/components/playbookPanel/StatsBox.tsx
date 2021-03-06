import React, { FC } from 'react';
import { Box, Heading } from 'grommet';

import { StatType } from '../../@types/enums';
import { CharacterStat } from '../../@types/dataInterfaces';
import { accentColors, RedBox } from '../../config/grommetConfig';
import CollapsiblePanelBox from '../CollapsiblePanelBox';

interface StatsBoxProps {
  stats: CharacterStat[];
  togglingHighlight: boolean;
  handleToggleHighlight: (stat: StatType) => void;
  navigateToCharacterCreation?: (step: string) => void;
}

const StatsBox: FC<StatsBoxProps> = ({ stats, togglingHighlight, handleToggleHighlight, navigateToCharacterCreation }) => {
  const statBoxStyle = (isHighlighted: boolean) => ({
    backgroundColor: isHighlighted ? accentColors[2] : '#000',
    cursor: 'pointer',
  });

  return (
    <CollapsiblePanelBox open title="Stats" navigateToCharacterCreation={navigateToCharacterCreation} targetCreationStep="4">
      <Box
        fill="horizontal"
        direction="row"
        align="center"
        justify="around"
        pad="12px"
        gap="12px"
        wrap
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        {stats.map((stat) => {
          return (
            <RedBox
              data-testid={`${stat.stat}`}
              key={stat.id}
              align="center"
              width="76px"
              style={statBoxStyle(stat.isHighlighted)}
              onClick={() => !togglingHighlight && handleToggleHighlight(stat.stat)}
            >
              <Heading
                aria-label={`${stat.stat.toLowerCase()}-value`}
                level="2"
                margin={{ left: '6px', right: '6px', bottom: '3px', top: '9px' }}
              >
                {stat.value}
              </Heading>
              <Heading level="3" margin={{ left: '6px', right: '6px', bottom: '3px', top: '3px' }}>
                {stat.stat}
              </Heading>
            </RedBox>
          );
        })}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default StatsBox;
