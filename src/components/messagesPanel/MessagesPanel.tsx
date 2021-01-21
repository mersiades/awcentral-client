import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from 'grommet';

import PrintMessage from './PrintMessage';
import { accentColors } from '../../config/grommetConfig';
import { MessageType } from '../../@types/enums';
import { GameMessage } from '../../@types/dataInterfaces';
import { useGame } from '../../contexts/gameContext';

const MessagesPanel: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [ticker, setTicker] = useState(0);
  const { game, userGameRole } = useGame();

  // -------------------------------------------------- Component refs ---------------------------------------------------- //
  const messageEndRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const scrollToBottom = () => {
    !!messageEndRef.current && messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Limits the message rendered to the 10 most recent messages
  const limitMessages = () => {
    if (!!game && !!game.gameMessages) {
      const start = game.gameMessages.length < 10 ? 0 : game.gameMessages.length - 10;
      const end = game.gameMessages.length;
      return game.gameMessages.slice(start, end);
    } else {
      return [];
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //
  // Adds a ticker so that "sentOn" will update every minute
  useEffect(() => {
    const interval = window.setInterval(() => setTicker(ticker + 1), 60000);
    return () => window.clearInterval(interval);
  }, [ticker]);

  // Scrolls down to the newest message whenever a new message comes in
  useEffect(() => {
    scrollToBottom();
  }, [game?.gameMessages]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  // Renders message based on messageType
  const renderMoveMessage = (message: GameMessage, index: number, ticker: number) => {
    switch (message.messageType) {
      case MessageType.printMove:
        return <PrintMessage messagesLength={limitMessages().length} index={index} message={message} ticker={ticker} />;
      default:
        return;
    }
  };

  return (
    <Box fill pad="12px" overflow="auto" gap="12px">
      {limitMessages().map((message, index) => {
        const isUserSender = userGameRole?.id === message.gameroleId;
        return (
          <Box
            key={index}
            pad="12px"
            border={{ color: isUserSender ? '#FFF' : accentColors[0] }}
            style={{ minHeight: 'fit-content' }}
          >
            {renderMoveMessage(message, index, ticker)}
          </Box>
        );
      })}
      <div ref={messageEndRef} />
    </Box>
  );
};

export default MessagesPanel;
