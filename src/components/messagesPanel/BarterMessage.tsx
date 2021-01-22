import React, { FC } from 'react';
import { Box } from 'grommet';

import MoveMessage from './MoveMessage';
import { StyledMarkdown } from '../styledComponents';
import { GameMessage } from '../../@types/dataInterfaces';
import { ParagraphWS } from '../../config/grommetConfig';

export interface BarterMessageProps {
  message: GameMessage;
  messagesLength: number;
  index: number;
  ticker: number;
}

const BarterMessage: FC<BarterMessageProps> = ({ message, messagesLength, index, ticker }) => {
  return (
    <MoveMessage message={message} messagesLength={messagesLength} index={index} ticker={ticker}>
      <>
        <Box direction="row" justify="between" align="center">
          <ParagraphWS alignSelf="start">{`Barter spent: ${message.barterSpent}`}</ParagraphWS>
          <ParagraphWS alignSelf="start">{`Barter left: ${message.currentBarter}`}</ParagraphWS>
        </Box>
        <StyledMarkdown>{message.content}</StyledMarkdown>
      </>
    </MoveMessage>
  );
};

export default BarterMessage;
