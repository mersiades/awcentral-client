import { Box } from 'grommet';
import React, { FC } from 'react';

interface SpinnerProps {
  fillColor?: string;
  width?: string;
  height?: string;
  fillHorizontal?: boolean;
  fillVertical?: boolean;
}

const Spinner: FC<SpinnerProps> = ({
  fillColor = '#4C684C',
  width = '28px',
  height = '28px',
  fillHorizontal = false,
  fillVertical = false,
}) => {
  const spinning = (
    <svg version="1.1" viewBox="0 0 32 32" width="28px" height="28px" fill={fillColor}>
      <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" />
      <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 16 16"
          to="360 16 16"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );

  const getFill = () => {
    let fill: boolean | 'horizontal' | 'vertical' = false;
    if (fillHorizontal) {
      fill = 'horizontal';
    }

    if (fillVertical) {
      fill = 'vertical';
    }

    if (fillHorizontal && fillVertical) {
      fill = true;
    }
    return fill;
  };

  return (
    <Box data-testid="spinner" fill={getFill()} align="center" justify="center" width={width} height={height}>
      {spinning}
    </Box>
  );
};

export default Spinner;
