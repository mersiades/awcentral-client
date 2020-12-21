import React, { FC } from 'react';
import { Box, Grid, Text } from 'grommet';

import { Game } from '../@types';
import { CustomUL } from '../config/grommetConfig';

interface GameCreationStepperProps {
  currentStep: number;
  setCreationStep: (step: number) => void;
  game: Game;
}

const GameCreationStepper: FC<GameCreationStepperProps> = ({ currentStep, setCreationStep, game }) => {
  const renderComms = () => {
    if (!!game.commsApp) {
      if (!!game.commsUrl) {
        return <Text truncate>{`${game.commsApp} @ ${game.commsUrl}`}</Text>;
      } else {
        return <Text truncate>{game.commsApp}</Text>;
      }
    } else if (!!game.commsUrl) {
      return <Text truncate>{game.commsUrl}</Text>;
    } else {
      return <Text alignSelf="center">...</Text>;
    }
  };
  return (
    <Box
      direction="row"
      fill="horizontal"
      background="black"
      justify="center"
      align="center"
      height="195px"
      pad={{ bottom: '12px' }}
    >
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
          gridArea="name-box"
          align="center"
          justify="start"
          background={{ color: 'neutral-1', opacity: 0.5 }}
          border
          pad="12px"
        >
          <Text color="white" weight="bold">
            Name
          </Text>
          {!!game.name ? <Text>{game.name}</Text> : <Text>...</Text>}
        </Box>
        <Box
          fill
          gridArea="channel-box"
          align="center"
          justify="start"
          background={{ color: 'neutral-1', opacity: currentStep === 0 ? 1 : 0.5 }}
          border
          onClick={() => setCreationStep(0)}
          pad="12px"
        >
          <Text color="white" weight="bold">
            Channel
          </Text>
          <Box width="100%">{renderComms()}</Box>
        </Box>
        <Box
          fill
          gridArea="invitations-box"
          align="center"
          justify="start"
          background={{ color: 'neutral-1', opacity: currentStep === 1 ? 1 : 0.5 }}
          border
          onClick={() => setCreationStep(1)}
          pad="12px"
        >
          <Text color="white" weight="bold">
            Invitations
          </Text>
          {game.invitees.length > 0 ? (
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
