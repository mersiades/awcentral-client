import React, { FC } from 'react';
import { Box } from 'grommet';
import { Trash } from 'grommet-icons';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { TextWS } from '../../config/grommetConfig';
import { useGame } from '../../contexts/gameContext';

const PlayersBox: FC = () => {
  const { game, allPlayerGameRoles } = useGame();
  const renderPlayers = () => {
    if (allPlayerGameRoles?.length === 0 || !allPlayerGameRoles) {
      return (
        <Box direction="row" align="center" alignContent="end" fill margin={{ vertical: 'small' }}>
          <Box align="start" fill>
            <TextWS>No players yet</TextWS>
          </Box>
        </Box>
      );
    } else {
      return game?.players.map((player) => {
        return (
          <Box
            key={player.displayName}
            direction="row"
            align="center"
            alignContent="end"
            fill
            margin={{ vertical: 'small' }}
          >
            <Box align="start" fill>
              <TextWS>{player.displayName}</TextWS>
            </Box>
            <Box align="end" fill>
              <Trash color="accent-1" onClick={() => console.log('clicked')} cursor="grab" />
            </Box>
          </Box>
        );
      });
    }
  };

  return (
    <CollapsiblePanelBox open title="Players">
      <Box
        fill="horizontal"
        justify="between"
        align="start"
        gap="12px"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        {renderPlayers()}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default PlayersBox;
