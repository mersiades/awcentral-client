import React, { FC } from 'react';
import { Box, Heading } from 'grommet';
import { Edit } from 'grommet-icons';

import { Stats } from '../../@types/enums';
import { CharacterStat } from '../../@types/dataInterfaces';
import { accentColors, RedBox } from '../../config/grommetConfig';

interface StatsBoxProps {
  stats: CharacterStat[];
  togglingHighlight: boolean;
  handleToggleHighlight: (stat: Stats) => void;
  navigateToCharacterCreation?: (step: number) => void;
}

const StatsBox: FC<StatsBoxProps> = ({ stats, togglingHighlight, handleToggleHighlight, navigateToCharacterCreation }) => {
  const statBoxStyle = (isHighlighted: boolean) => ({
    backgroundColor: isHighlighted ? accentColors[2] : '#000',
    cursor: 'pointer',
  });

  return (
    <Box fill="horizontal" pad={{ vertical: '12px' }}>
      <Box
        fill="horizontal"
        direction="row"
        align="center"
        justify={!!navigateToCharacterCreation ? 'between' : 'start'}
        pad={{ vertical: '12px' }}
      >
        <Heading level="3" margin="0px">
          Stats
        </Heading>
        {!!navigateToCharacterCreation && (
          <Edit color="accent-1" onClick={() => navigateToCharacterCreation(4)} style={{ cursor: 'pointer' }} />
        )}
      </Box>
      <Box fill="horizontal" direction="row" align="center" justify="around" pad="12px" gap="12px" wrap>
        {stats.map((stat) => {
          return (
            <RedBox
              data-testid={`${stat.stat}-box`}
              key={stat.id}
              align="center"
              width="76px"
              style={statBoxStyle(stat.isHighlighted)}
              onClick={() => !togglingHighlight && handleToggleHighlight(stat.stat)}
            >
              <Heading level="2" margin={{ left: '6px', right: '6px', bottom: '3px', top: '9px' }}>
                {stat.value}
              </Heading>
              <Heading level="3" margin={{ left: '6px', right: '6px', bottom: '3px', top: '3px' }}>
                {stat.stat}
              </Heading>
            </RedBox>
          );
        })}
      </Box>
    </Box>
  );
};

export default StatsBox;
