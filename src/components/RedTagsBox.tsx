import React, { FC } from 'react';
import { Box } from 'grommet';

import { RedBox, TextWS } from '../config/grommetConfig';

interface RedTagsBoxProps {
  tags: string[];
  label: string;
  height: string;
}

const RedTagsBox: FC<RedTagsBoxProps> = ({ tags, label, height }) => {
  return (
    <Box align="center" justify="between" height={height} gap="6px" margin={{ bottom: '6px' }} style={{ maxWidth: '320px' }}>
      <RedBox pad="12px" fill justify="center">
        <TextWS>{tags.join(', ')}</TextWS>
      </RedBox>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );
};

export default RedTagsBox;
