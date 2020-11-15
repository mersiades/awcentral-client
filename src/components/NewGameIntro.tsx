import { Anchor, Box, Button, Heading, Paragraph } from 'grommet';
import React, { FC } from 'react';

interface NewGameIntroProps {
  gameName: string;
  voiceChannelUrl: string;
  closeNewGameIntro: () => void;
}

const NewGameIntro: FC<NewGameIntroProps> = ({ gameName, voiceChannelUrl, closeNewGameIntro }) => {
  return (
    <Box
      direction="column"
      fill
      background="black"
      align="center"
      justify="center"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Heading level={1}>NEW GAME</Heading>
      <Paragraph textAlign="center" size="large">
        Welcome to the jungle, baby.
      </Paragraph>
      <Paragraph textAlign="center" size="medium">
        If you haven't already, join the rest of your crew on Discord at{' '}
        <Anchor href={voiceChannelUrl} target="_blank" rel="noopener noreferrer">
          {`${gameName}-voice`}
        </Anchor>
        .
      </Paragraph>
      <Paragraph textAlign="center" size="medium">
        Once everyone's ready, punch NEXT to get started.
      </Paragraph>
      <Button label="NEXT" primary size="large" onClick={() => closeNewGameIntro()} margin="36px" />
    </Box>
  );
};

export default NewGameIntro;
