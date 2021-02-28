import { Box } from 'grommet';
import React, { FC } from 'react';
import { RedBox, HeadingWS, TextWS } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';

interface DoubleRedBoxProps {
  value: string;
  label: string;
  width?: string;
  height?: string;
}

const DoubleRedBox: FC<DoubleRedBoxProps> = ({ value, label, width, height = '90px' }) => {
  const { crustReady } = useFonts();
  return (
    <Box
      data-testid={`${label.toLowerCase()}-box`}
      align="center"
      justify="between"
      height={height}
      width={width}
      gap="6px"
      margin={{ bottom: '6px' }}
    >
      <RedBox pad="12px" align="center" fill justify="center">
        <HeadingWS
          aria-label={`${label.toLowerCase()}-value`}
          crustReady={crustReady}
          level={3}
          margin={{ horizontal: '9px', bottom: '-3px', top: '3px' }}
        >
          {value}
        </HeadingWS>
      </RedBox>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );
};

export default DoubleRedBox;
