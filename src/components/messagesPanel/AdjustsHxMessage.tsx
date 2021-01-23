import React, { FC } from 'react';

import MoveMessage from './MoveMessage';
import { StyledMarkdown } from '../styledComponents';
import { GameMessage } from '../../@types/dataInterfaces';

export interface AdjustHxMessageProps {
  message: GameMessage;
  messagesLength: number;
  index: number;
  ticker: number;
}

const AdjustHxMessage: FC<AdjustHxMessageProps> = ({ message, messagesLength, index, ticker }) => {
  return (
    <MoveMessage message={message} messagesLength={messagesLength} index={index} ticker={ticker}>
      <StyledMarkdown>{message.content}</StyledMarkdown>
    </MoveMessage>
  );
};

export default AdjustHxMessage;
