import { Box } from 'grommet';
import React, { FC } from 'react';
import { RedBox, HeadingWS, TextWS } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';

interface SingleRedBoxProps {
  value: string;
  label: string;
}

const SingleRedBox: FC<SingleRedBoxProps> = ({ value, label }) => {
  const { crustReady } = useFonts();
  return (
    <Box align="center" justify="between" height="90px" gap="6px" margin={{ bottom: '6px' }}>
      <RedBox align="center" width="50px" fill="vertical" justify="center">
        <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
          {value}
        </HeadingWS>
      </RedBox>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );
};

export default SingleRedBox;
