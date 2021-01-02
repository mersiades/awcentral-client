import React, { FC } from 'react';
import { Anchor, Box } from 'grommet';

import { Game } from '../@types';
import { ButtonWS, HeadingWS, ParagraphWS } from '../config/grommetConfig';

interface NewGameIntroProps {
  closeNewGameIntro: () => void;
  game?: Game;
}

const NewGameIntro: FC<NewGameIntroProps> = ({ game, closeNewGameIntro }) => {
  const renderComms = () => {
    if (!!game) {
      if (!!game.commsApp) {
        if (!!game.commsUrl) {
          return (
            <ParagraphWS textAlign="center" size="medium">
              If you haven't already, join the rest of your crew on{' '}
              <Anchor href={game.commsUrl} target="_blank" rel="noopener noreferrer">
                {game.commsApp}
              </Anchor>
              .
            </ParagraphWS>
          );
        } else {
          return (
            <ParagraphWS textAlign="center" size="medium">
              {`If you haven't already, join the rest of your crew on ${game.commsApp}.`}
            </ParagraphWS>
          );
        }
      } else if (!!game.commsUrl) {
        return (
          <ParagraphWS textAlign="center" size="medium">
            If you haven't already, join the rest of your crew{' '}
            <Anchor href={game.commsUrl} target="_blank" rel="noopener noreferrer">
              here
            </Anchor>
            .
          </ParagraphWS>
        );
      }
    } else {
      // return skeleton
      return null;
    }
  };
  return (
    <Box
      fill
      direction="column"
      background="transparent"
      align="center"
      justify="center"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Box width="60vw" flex="grow" align="center" justify="between">
        <div>
          <HeadingWS textAlign="center" level={2} style={{ maxWidth: 'unset' }}>
            NEW GAME
          </HeadingWS>
          <ParagraphWS textAlign="center" size="large">
            Welcome to the jungle, baby.
          </ParagraphWS>
          {renderComms()}
          <ParagraphWS textAlign="center" size="medium">
            Once everyone's ready, punch NEXT to get started.
          </ParagraphWS>
        </div>
        <ButtonWS label="NEXT" primary size="large" onClick={() => closeNewGameIntro()} margin="24px" alignSelf="end" />
      </Box>
    </Box>
  );
};

export default NewGameIntro;
