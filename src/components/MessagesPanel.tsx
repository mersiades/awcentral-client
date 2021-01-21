import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Box } from 'grommet';
import React, { FC, useEffect, useRef } from 'react';
import { accentColors, HeadingWS, TextWS } from '../config/grommetConfig';
import { useGame } from '../contexts/gameContext';
import { StyledMarkdown } from './styledComponents';

const MessagesPanel: FC = () => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { game } = useGame();

  dayjs.extend(relativeTime);

  const scrollToBottom = () => {
    !!messageEndRef.current && messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const limitMessages = () => {
    if (!!game && !!game.gameMessages) {
      const start = game.gameMessages.length < 10 ? 0 : game.gameMessages.length - 10;
      const end = game.gameMessages.length;
      return game.gameMessages.slice(start, end);
    } else {
      return [];
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [game?.gameMessages]);

  const renderMessage = (title: string, content: string, sentOn: string) => (
    <>
      <Box direction="row" justify="between" align="center">
        <HeadingWS level={4} margin={{ vertical: '6px' }}>
          {title}
        </HeadingWS>
        <TextWS color="neutral-1">{sentOn}</TextWS>
      </Box>
      <StyledMarkdown>{content}</StyledMarkdown>
    </>
  );

  return (
    <Box fill pad="12px" overflow="auto" gap="12px">
      {limitMessages().map((message, index) => {
        return (
          <Box key={index} pad="12px" border={{ color: accentColors[1] }} style={{ minHeight: 'fit-content' }}>
            {renderMessage(message.title, message.content, dayjs(message.sentOn).fromNow())}
          </Box>
        );
      })}
      <div ref={messageEndRef} />
    </Box>
  );
};

export default MessagesPanel;
