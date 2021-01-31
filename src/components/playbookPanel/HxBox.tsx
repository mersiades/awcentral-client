import React, { FC } from 'react';
import { Box } from 'grommet';
import { CaretUpFill, CaretDownFill } from 'grommet-icons';

import { HeadingWS, RedBox } from '../../config/grommetConfig';
import { HxStat } from '../../@types/dataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import CollapsiblePanelBox from '../CollapsiblePanelBox';

interface HxBoxProps {
  hxStats: HxStat[];
  adjustingHx: boolean;
  handleAdjustHx: (hxId: string, value: number) => void;
  navigateToCharacterCreation: (step: string) => void;
}

const HxBox: FC<HxBoxProps> = ({ hxStats, adjustingHx, handleAdjustHx, navigateToCharacterCreation }) => {
  const { crustReady } = useFonts();

  const increaseHx = (hxId: string, hxValue: number) => {
    handleAdjustHx(hxId, hxValue + 1);
  };

  const decreaseHx = (hxId: string, hxValue: number) => {
    handleAdjustHx(hxId, hxValue - 1);
  };

  return (
    <CollapsiblePanelBox open title="Hx" navigateToCharacterCreation={navigateToCharacterCreation} targetCreationStep="8">
      <Box
        data-testid="hx-box"
        fill="horizontal"
        direction="row"
        justify="around"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        {hxStats.map((stat) => (
          <Box key={stat.characterId} fill="horizontal" justify="between" align="start" wrap>
            <Box direction="row" align="center" gap="12px">
              <RedBox width="50px" align="center" margin={{ left: '12px' }}>
                <HeadingWS
                  crustReady={crustReady}
                  level="2"
                  margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}
                >
                  {stat.hxValue}
                </HeadingWS>
              </RedBox>
              <Box align="center" justify="around">
                {adjustingHx ? (
                  <Box width="48px" height="80px" />
                ) : (
                  <Box
                    align="center"
                    justify="around"
                    animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
                  >
                    <CaretUpFill
                      data-testid="increase-hx-caret"
                      size="large"
                      color="brand"
                      onClick={() => increaseHx(stat.characterId, stat.hxValue)}
                      style={{ height: '40px' }}
                    />
                    <CaretDownFill
                      data-testid="decrease-hx-caret"
                      size="large"
                      color="brand"
                      onClick={() => decreaseHx(stat.characterId, stat.hxValue)}
                      style={{ height: '40px' }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
            <HeadingWS crustReady={crustReady} level="4" margin={{ vertical: '6px', left: '12px' }}>
              {stat.characterName}
            </HeadingWS>
          </Box>
        ))}
      </Box>
    </CollapsiblePanelBox>
  );
};
export default HxBox;
