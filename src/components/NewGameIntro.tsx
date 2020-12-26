import { Anchor, Box, Button, Heading, Paragraph } from 'grommet';
import React, { FC } from 'react';
import { Game } from '../@types';

interface NewGameIntroProps {
  game: Game;
  closeNewGameIntro: () => void;
}

const NewGameIntro: FC<NewGameIntroProps> = ({ game, closeNewGameIntro }) => {
  console.log('game', game);
  const renderComms = () => {
    if (!!game.commsApp) {
      if (!!game.commsUrl) {
        return (
          <Paragraph textAlign="center" size="medium">
            If you haven't already, join the rest of your crew on{' '}
            <Anchor href={game.commsUrl} target="_blank" rel="noopener noreferrer">
              {game.commsApp}
            </Anchor>
            .
          </Paragraph>
        );
      } else {
        return (
          <Paragraph textAlign="center" size="medium">
            {`If you haven't already, join the rest of your crew on ${game.commsApp}.`}
          </Paragraph>
        );
      }
    } else if (!!game.commsUrl) {
      return (
        <Paragraph textAlign="center" size="medium">
          If you haven't already, join the rest of your crew{' '}
          <Anchor href={game.commsUrl} target="_blank" rel="noopener noreferrer">
            here
          </Anchor>
          .
        </Paragraph>
      );
    }
  };
  return (
    <Box
      direction="column"
      // fill
      align="center"
      justify="center"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Heading level={2}>NEW GAME</Heading>
      <Paragraph textAlign="center" size="large">
        Welcome to the jungle, baby.
      </Paragraph>
      {renderComms()}
      <Paragraph textAlign="center" size="medium">
        Once everyone's ready, punch NEXT to get started.
      </Paragraph>
      <Button label="NEXT" primary size="large" onClick={() => closeNewGameIntro()} margin="36px" />
    </Box>
  );
};

export default NewGameIntro;
