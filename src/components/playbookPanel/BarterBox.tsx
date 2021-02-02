import React, { FC, useState } from 'react';
import { Box } from 'grommet';
import { FormUp, FormDown, CaretUpFill, CaretDownFill } from 'grommet-icons';

import { HeadingWS, RedBox } from '../../config/grommetConfig';
import { StyledMarkdown } from '../styledComponents';
import { useFonts } from '../../contexts/fontContext';

interface BarterBoxProps {
  barter: number;
  instructions: string;
  settingBarter: boolean;
  handleSetBarter: (amount: number) => void;
}

const BarterBox: FC<BarterBoxProps> = ({ barter, instructions, handleSetBarter, settingBarter }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const { crustReady } = useFonts();

  const increaseBarter = () => {
    handleSetBarter(barter + 1);
  };

  const decreaseBarter = () => {
    handleSetBarter(barter - 1);
  };

  return (
    <Box fill="horizontal" align="center" justify="start" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.25)' }}>
      <Box fill="horizontal" direction="row" justify="between" align="center" pad={{ vertical: '12px' }}>
        <Box direction="row" align="center" gap="12px" pad={{ vertical: '12px' }}>
          <HeadingWS crustReady={crustReady} level="3" margin="0px">
            Barter
          </HeadingWS>
        </Box>
        <Box direction="row" align="center" gap="12px">
          {showInstructions ? (
            <FormUp onClick={() => setShowInstructions(false)} />
          ) : (
            <FormDown onClick={() => setShowInstructions(true)} />
          )}
          <RedBox data-testid="barter-value-box" width="50px" align="center" margin={{ left: '12px' }}>
            <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
              {barter}
            </HeadingWS>
          </RedBox>
          <Box align="center" justify="around">
            {settingBarter ? (
              <Box width="48px" height="80px" />
            ) : (
              <Box align="center" justify="around" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
                <CaretUpFill
                  data-testid="increase-barter-caret"
                  size="large"
                  color="brand"
                  onClick={increaseBarter}
                  style={{ height: '40px' }}
                />
                <CaretDownFill
                  data-testid="decrease-barter-caret"
                  size="large"
                  color="brand"
                  onClick={decreaseBarter}
                  style={{ height: '40px' }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {showInstructions && (
        <Box fill="horizontal" pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <StyledMarkdown>{instructions}</StyledMarkdown>
        </Box>
      )}
    </Box>
  );
};

export default BarterBox;
