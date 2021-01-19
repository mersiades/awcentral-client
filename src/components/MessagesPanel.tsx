import { Box } from 'grommet';
import React, { FC } from 'react';
import { accentColors, HeadingWS } from '../config/grommetConfig';
import { useGame } from '../contexts/gameContext';
import { StyledMarkdown } from './styledComponents';

const MessagesPanel: FC = () => {
  const { game } = useGame();

  const renderMessage = (sender: string, content: string, index: number) => (
    <>
      <HeadingWS level={4} margin={{ vertical: '6px' }}>
        {sender}
      </HeadingWS>
      <StyledMarkdown>{content}</StyledMarkdown>
    </>
  );
  return (
    <Box fill pad="12px" overflow="auto" gap="12px">
      {game?.gameMessages.map((message, index) => {
        return (
          <Box key={index} pad="12px" border={{ color: accentColors[1] }} flex="grow">
            {renderMessage(message.senderName, message.content, index)}
          </Box>
        );
      })}
    </Box>
  );
};

export default MessagesPanel;
