import React, { FC } from 'react';
import { Box } from 'grommet';

import GameBox from './GameBox';
import PlayersBox from './PlayersBox';
import InvitationsBox from './InvitationsBox';
import { ShowInvitation } from '../../pages/MCPage';

interface GamePanelProps {
  setShowDeleteGameDialog: (show: boolean) => void;
  showGameForm: (value: 'GAME_FORM' | 'MESSAGES') => void;
  setShowInvitationForm: (showInvitation: ShowInvitation) => void;
  handleRemoveInvitee: (email: string) => void;
}

const GamePanel: FC<GamePanelProps> = ({
  setShowDeleteGameDialog,
  setShowInvitationForm,
  showGameForm,
  handleRemoveInvitee,
}) => {
  return (
    <Box direction="row" wrap pad="12px" overflow="auto">
      <GameBox showGameForm={() => showGameForm('GAME_FORM')} setShowDeleteGameDialog={setShowDeleteGameDialog} />
      <PlayersBox />
      <InvitationsBox setShowInvitationForm={setShowInvitationForm} handleRemoveInvitee={handleRemoveInvitee} />
    </Box>
  );
};

export default GamePanel;
