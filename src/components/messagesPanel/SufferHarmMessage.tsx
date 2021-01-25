import React, { FC } from 'react';
import { Box } from 'grommet';

import MoveMessage from './MoveMessage';
import { StyledMarkdown } from '../styledComponents';
import { GameMessage } from '../../@types/dataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { HeadingWS, TextWS } from '../../config/grommetConfig';
import { getDiceImage } from '../../helpers/getDiceImage';
import HarmClock from '../HarmClock';
import { Next } from 'grommet-icons';

export interface SufferHarmMessageProps {
  message: GameMessage;
  messagesLength: number;
  index: number;
  ticker: number;
}

const SufferHarmMessage: FC<SufferHarmMessageProps> = ({ message, messagesLength, index, ticker }) => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady, vtksReady } = useFonts();

  return (
    <MoveMessage message={message} messagesLength={messagesLength} index={index} ticker={ticker}>
      <Box fill>
        <Box fill="horizontal" align="center" justify="center" pad="12px">
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
                {message.harmSuffered}
              </HeadingWS>
              <TextWS>HARM</TextWS>
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
          <Box direction="row" justify="around" align="center" pad="12px" width="67%">
            <HarmClock harmValue={message.currentHarm - message.harmSuffered} isStabilized={false} diameter={100} />
            <Next color="#FFF" />
            <HarmClock harmValue={message.currentHarm} isStabilized={false} diameter={100} />
          </Box>
        </Box>
        <StyledMarkdown>{message.content}</StyledMarkdown>
      </Box>
    </MoveMessage>
  );
};

export default SufferHarmMessage;
