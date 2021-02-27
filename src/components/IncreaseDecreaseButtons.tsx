import React, { FC, useEffect, useState } from 'react';
import { Box } from 'grommet';
import styled from 'styled-components';
import { brandColor } from '../config/grommetConfig';

interface IncreaseDecreaseButtonsProps {
  loading: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

const UpArrow = styled.div`
  width: 0;
  height: 0;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-bottom: 10px solid ${brandColor};
  margin: 6px;
`;

const DownArrow = styled.div`
  width: 0;
  height: 0;
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-top: 10px solid ${brandColor};
  margin: 6px;
`;

const ArrowSpacer = styled.div`
  width: 32px;
  height: 22px;
`;

const IncreaseDecreaseButtons: FC<IncreaseDecreaseButtonsProps> = ({ loading, onIncrease, onDecrease }) => {
  const [showUp, setShowUp] = useState(true);
  const [showDown, setShowDown] = useState(true);

  useEffect(() => {
    let timeout: number;

    if (!loading) {
      setShowUp(true);
      setShowDown(true);
    } else {
      timeout = window.setTimeout(() => {
        !loading && setShowUp(true);
        !loading && setShowDown(true);
      }, 250);
    }
    return () => window.clearTimeout(timeout);
  }, [loading]);

  return (
    <Box align="center" justify="center">
      {showUp ? (
        <Box animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <UpArrow
            data-testid="increase-caret"
            onClick={() => {
              onIncrease();
              setShowUp(false);
            }}
          />
        </Box>
      ) : (
        <ArrowSpacer />
      )}
      {showDown ? (
        <Box animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <DownArrow
            data-testid="decrease-caret"
            onClick={() => {
              onDecrease();
              setShowDown(false);
            }}
          />
        </Box>
      ) : (
        <ArrowSpacer />
      )}
    </Box>
  );
};

export default IncreaseDecreaseButtons;
