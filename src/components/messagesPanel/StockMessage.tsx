import React, { FC } from 'react';
import { Box } from 'grommet';

import MoveMessage from './MoveMessage';
import { StyledMarkdown } from '../styledComponents';
import { GameMessage } from '../../@types/dataInterfaces';
import { ParagraphWS } from '../../config/grommetConfig';

export interface StockMessageProps {
  message: GameMessage;
  messagesLength: number;
  index: number;
  ticker: number;
}

const StockMessage: FC<StockMessageProps> = ({ message, messagesLength, index, ticker }) => {
  return (
    <MoveMessage message={message} messagesLength={messagesLength} index={index} ticker={ticker}>
      <>
        <Box fill="horizontal" direction="row" justify="around" align="center">
          <ParagraphWS alignSelf="start">{`Stock spent: ${message.stockSpent}`}</ParagraphWS>
          <ParagraphWS alignSelf="start">{`Stock left: ${message.currentStock}`}</ParagraphWS>
        </Box>
        <StyledMarkdown>{message.content}</StyledMarkdown>
      </>
    </MoveMessage>
  );
};

export default StockMessage;
