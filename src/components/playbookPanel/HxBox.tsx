import React, { FC } from 'react';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import SingleRedBox from '../SingleRedBox';
import { HxStat } from '../../@types/dataInterfaces';

interface HxBoxProps {
  hxStats: HxStat[];
  adjustingHx: boolean;
  handleAdjustHx: (hxId: string, value: number) => void;
  navigateToCharacterCreation: (step: string) => void;
}

const HxBox: FC<HxBoxProps> = ({ hxStats, adjustingHx, handleAdjustHx, navigateToCharacterCreation }) => {
  const increaseHx = (hxId: string, hxValue: number) => {
    handleAdjustHx(hxId, hxValue + 1);
  };

  const decreaseHx = (hxId: string, hxValue: number) => {
    handleAdjustHx(hxId, hxValue - 1);
  };

  return (
    <CollapsiblePanelBox open title="Hx" navigateToCharacterCreation={navigateToCharacterCreation} targetCreationStep="10">
      <Box
        data-testid="hx-box"
        fill="horizontal"
        direction="row"
        justify="around"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        {hxStats.map((stat) => (
          <SingleRedBox
            key={stat.characterId}
            value={stat.hxValue.toString()}
            label={stat.characterName}
            loading={adjustingHx}
            onIncrease={() => increaseHx(stat.characterId, stat.hxValue)}
            onDecrease={() => decreaseHx(stat.characterId, stat.hxValue)}
          />
        ))}
      </Box>
    </CollapsiblePanelBox>
  );
};
export default HxBox;
