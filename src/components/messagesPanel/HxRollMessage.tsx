import React, { FC } from 'react';

import MoveMessage from './MoveMessage';
import { StyledMarkdown } from '../styledComponents';
import { GameMessage } from '../../@types/dataInterfaces';
import { HeadingWS, TextWS } from '../../config/grommetConfig';
import { Box } from 'grommet';
import { useFonts } from '../../contexts/fontContext';

export interface HxRollMessageProps {
  message: GameMessage;
  messagesLength: number;
  index: number;
  ticker: number;
}

const HxRollMessage: FC<HxRollMessageProps> = ({ message, messagesLength, index, ticker }) => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady, vtksReady } = useFonts();

  const getDiceImage = (value: number) => {
    switch (value) {
      case 1:
        return <img src="/images/d6-1.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
      case 2:
        return <img src="/images/d6-2.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
      case 3:
        return <img src="/images/d6-3.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
      case 4:
        return <img src="/images/d6-4.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
      case 5:
        return <img src="/images/d6-5.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
      case 6:
        return <img src="/images/d6-6.png" style={{ maxWidth: '50px' }} alt={`A die with face value of ${value}`} />;
    }
  };
  return (
    <MoveMessage message={message} messagesLength={messagesLength} index={index} ticker={ticker}>
      <Box fill>
        <Box fill="horizontal" direction="row" align="center" justify="center" pad="12px">
          <Box direction="row" align="center" justify="around" width="67%">
            {getDiceImage(message.roll1)}
            <HeadingWS crustReady={crustReady} level={2} color="brand" margin="3px">
              +
            </HeadingWS>
            {getDiceImage(message.roll2)}
            <HeadingWS crustReady={crustReady} level={2} color="brand" margin="3px">
              +
            </HeadingWS>
            <Box align="center" justify="between" pad="12px">
              <HeadingWS
                crustReady={crustReady}
                level={2}
                color="brand"
                margin={{ top: '32px', bottom: '0px', horizontal: '3px' }}
              >
                {message.rollModifier}
              </HeadingWS>
              <TextWS>{message.modifierStatName}</TextWS>
            </Box>
            <HeadingWS crustReady={crustReady} level={2} color="brand" margin="3px">
              =
            </HeadingWS>
            <Box align="center" justify="between" pad={{ vertical: '12px', horizontal: '24px' }}>
              <HeadingWS vtksReady={vtksReady} level={1} color="brand" margin="3px" style={{ fontSize: '80px' }}>
                {message.rollResult}
              </HeadingWS>
            </Box>
          </Box>
        </Box>
        <StyledMarkdown>{message.content}</StyledMarkdown>
      </Box>
    </MoveMessage>
  );
};

export default HxRollMessage;
