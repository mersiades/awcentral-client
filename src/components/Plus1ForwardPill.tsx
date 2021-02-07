import { Box, BoxProps, Text } from 'grommet';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { accentColors } from '../config/grommetConfig';

export const PillBox = styled(Box as FC<BoxProps & JSX.IntrinsicElements['div']>)(() => {
  return css`
    background-color: ${accentColors[2]};
    padding: 12px;
    margin: 12px;
    border-radius: 30px;
    box-shadow: 0 0 5px 1px #000, 0 0 8px 2px #000;
  `;
});

const Plus1ForwardPill = () => {
  return (
    <PillBox align="center" justify="center">
      <Text>
        <strong>+1forward</strong>
      </Text>
    </PillBox>
  );
};

export default Plus1ForwardPill;
