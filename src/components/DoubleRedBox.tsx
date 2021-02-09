import { Box } from 'grommet';
import React, { FC } from 'react';
import { RedBox, HeadingWS, TextWS } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';

interface DoubleRedBoxProps {
  value: string;
  label: string;
}

const DoubleRedBox: FC<DoubleRedBoxProps> = ({ value, label }) => {
  const { crustReady } = useFonts();
  return (
    <Box align="center" justify="between" height="90px" gap="6px" margin={{ bottom: '6px' }}>
      <RedBox pad="12px" align="center" fill justify="center">
        <HeadingWS crustReady={crustReady} level={3} margin={{ horizontal: '9px', bottom: '-3px', top: '3px' }}>
          {value}
        </HeadingWS>
      </RedBox>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );
};

export default DoubleRedBox;
