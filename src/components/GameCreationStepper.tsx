import React, { FC } from 'react';
import { Box, Grid, Text } from 'grommet';

import { Game } from '../@types/dataInterfaces';
import { CustomUL } from '../config/grommetConfig';

interface GameCreationStepperProps {
  currentStep: number;
  setCreationStep: (step: number) => void;
  setHasSkippedComms: (skipped: boolean) => void;
  game?: Game;
}

const GameCreationStepper: FC<GameCreationStepperProps> = ({ currentStep, setCreationStep, setHasSkippedComms, game }) => {
  const renderComms = () => {
    if (!!game && !!game.commsApp) {
      if (!!game.commsUrl) {
        return <Text truncate>{`${game.commsApp} @ ${game.commsUrl}`}</Text>;
      } else {
        return <Text truncate>{game.commsApp}</Text>;
      }
    } else if (!!game && !!game.commsUrl) {
      return <Text truncate>{game.commsUrl}</Text>;
    } else {
      return <Text alignSelf="center">...</Text>;
    }
  };

  return (
    <Box direction="row" fill="horizontal" justify="center" align="center" height="195px" pad={{ bottom: '12px' }}>
      <Grid
        fill
        gap="small"
        justifyContent="center"
        rows={['70px', '70px']}
        columns={['192px', '192px']}
        areas={[
          { name: 'name-box', start: [0, 0], end: [0, 0] },
          { name: 'channel-box', start: [0, 1], end: [0, 1] },
          { name: 'invitations-box', start: [1, 0], end: [1, 1] },
        ]}
      >
        <Box
          fill
          data-testid="name-box"
          gridArea="name-box"
          align="center"
          justify="start"
          pad="12px"
          border
          background={{ color: 'neutral-1', opacity: 0.5 }}
        >
          <Text color="white" weight="bold">
            Name
          </Text>
          {!!game?.name ? <Text>{game.name}</Text> : <Text>...</Text>}
        </Box>
        <Box
          data-testid="channel-box"
          gridArea="channel-box"
          fill
          align="center"
          justify="start"
          pad="12px"
          border
          background={{ color: 'neutral-1', opacity: currentStep === 1 ? 1 : 0.5 }}
          onClick={() => {
            setCreationStep(1);
            setHasSkippedComms(false);
          }}
        >
          <Text color="white" weight="bold">
            Channel
          </Text>
          <Box width="100%">{renderComms()}</Box>
        </Box>
        <Box
          data-testid="invitations-box"
          gridArea="invitations-box"
          fill
          align="center"
          justify="start"
          pad="12px"
          border
          background={{ color: 'neutral-1', opacity: currentStep === 2 ? 1 : 0.5 }}
          onClick={() => setCreationStep(2)}
        >
          <Text color="white" weight="bold">
            Invitations
          </Text>
          {!!game && game.invitees.length > 0 ? (
            <CustomUL>
              {game.invitees.map((invitee) => (
                <li key={invitee}>{invitee}</li>
              ))}
            </CustomUL>
          ) : (
            <Text>...</Text>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default GameCreationStepper;
