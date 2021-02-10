import { Box } from 'grommet';
import React, { FC } from 'react';
import { RedBox, HeadingWS, TextWS } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';
import IncreaseDecreaseButtons from './IncreaseDecreaseButtons';

interface SingleRedBoxProps {
  value: string;
  label: string;
  loading?: boolean;
  onIncrease?: () => void;
  onDecrease?: () => void;
  width?: string;
}

/**
 * Renders a styled red box for displaying a single digit,
 * with a label for the value below it.
 * If the `onIncrease` and `onDecrease` props are present,
 * also renders red arrows for increasing/decreasing the value.
 * @param
 */
const SingleRedBox: FC<SingleRedBoxProps> = ({ value, label, loading, onIncrease, onDecrease, width }) => {
  const { crustReady } = useFonts();
  return (
    <Box align="center" justify="between" height="90px" width={width} gap="6px" margin={{ bottom: '6px' }}>
      <Box direction="row">
        <RedBox align="center" width="50px" fill="vertical" justify="center">
          <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
            {value}
          </HeadingWS>
        </RedBox>
        {!!onIncrease && !!onDecrease && loading !== undefined && (
          <IncreaseDecreaseButtons loading={loading} onIncrease={onIncrease} onDecrease={onDecrease} />
        )}
      </Box>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );
};

export default SingleRedBox;
