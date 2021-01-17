import React, { FC } from 'react';
import { Box } from 'grommet';

import GameBox from './GameBox';
import PlayersBox from './PlayersBox';
import InvitationsBox from './InvitationsBox';
import { LeftPanelState } from '../../pages/MCPage';

interface GamePanelProps {
  setShowDeleteGameDialog: (show: boolean) => void;
  handleShowGameForm: (value: LeftPanelState) => void;
  handleShowInvitationForm: (value: LeftPanelState) => void;
  handleRemoveInvitee: (email: string) => void;
}

const GamePanel: FC<GamePanelProps> = ({
  setShowDeleteGameDialog,
  handleShowInvitationForm,
  handleShowGameForm,
  handleRemoveInvitee,
}) => {
  return (
    <Box direction="row" wrap pad="12px" overflow="auto">
      <GameBox
        handleShowGameForm={() => handleShowGameForm({ type: 'GAME_FORM' })}
        setShowDeleteGameDialog={setShowDeleteGameDialog}
      />
      <PlayersBox />
      <InvitationsBox handleShowInvitationForm={handleShowInvitationForm} handleRemoveInvitee={handleRemoveInvitee} />
    </Box>
  );
};

export default GamePanel;
