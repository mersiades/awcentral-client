import React, { FC } from 'react';
import { Box } from 'grommet';

import { RedBox, TextWS } from '../config/grommetConfig';

interface RedTagsBoxProps {
  tags: string[];
  label: string;
  height: string;
  maxWidth?: string;
}

const RedTagsBox: FC<RedTagsBoxProps> = ({ tags, label, height, maxWidth = '320px' }) => {
  return (
    <Box align="center" justify="between" height={height} gap="6px" margin={{ bottom: '6px' }} style={{ maxWidth }}>
      <RedBox pad="12px" fill justify="center">
        <TextWS>{tags.join(', ')}</TextWS>
      </RedBox>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );
};

export default RedTagsBox;
