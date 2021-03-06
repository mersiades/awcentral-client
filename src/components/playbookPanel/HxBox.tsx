import React, { FC } from 'react';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import SingleRedBox from '../SingleRedBox';
import { HxStat } from '../../@types/dataInterfaces';
import { HxInput } from '../../@types';
import { omit } from 'lodash';

interface HxBoxProps {
  hxStats: HxStat[];
  adjustingHx: boolean;
  handleAdjustHx: (hxStat: HxInput) => void;
  navigateToCharacterCreation: (step: string) => void;
}

const HxBox: FC<HxBoxProps> = ({ hxStats, adjustingHx, handleAdjustHx, navigateToCharacterCreation }) => {
  const increaseHx = (hxStat: HxInput) => {
    handleAdjustHx({ ...hxStat, hxValue: hxStat.hxValue + 1 });
  };

  const decreaseHx = (hxStat: HxInput) => {
    handleAdjustHx({ ...hxStat, hxValue: hxStat.hxValue - 1 });
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
            onIncrease={() => increaseHx(omit(stat, ['__typename']) as HxInput)}
            onDecrease={() => decreaseHx(omit(stat, ['__typename']) as HxInput)}
          />
        ))}
      </Box>
    </CollapsiblePanelBox>
  );
};
export default HxBox;
