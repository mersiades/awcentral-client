import React, { FC } from 'react';
import { Box } from 'grommet';
import { Trash } from 'grommet-icons';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { ButtonWS, TextWS } from '../../config/grommetConfig';
import { useGame } from '../../contexts/gameContext';

interface InvitationsBoxProps {
  setShowInvitationForm: (arg: { show: boolean; showMessageOnly: boolean; existingEmail: string }) => void;
  handleRemoveInvitee: (invitee: string) => void;
}

const InvitationsBox: FC<InvitationsBoxProps> = ({ setShowInvitationForm, handleRemoveInvitee }) => {
  const { game } = useGame();

  const renderInvitations = () => {
    if (!!game) {
      if (game.invitees.length === 0) {
        return (
          <Box direction="row" align="center" alignContent="end" fill margin={{ vertical: 'small' }}>
            <Box align="start" fill>
              <TextWS>No pending invitations</TextWS>
            </Box>
          </Box>
        );
      } else {
        return game.invitees.map((invitee) => {
          return (
            <Box key={invitee} direction="row" align="center" alignContent="end" fill margin={{ vertical: 'small' }}>
              <Box
                data-testid={`${invitee}-list-item`}
                align="start"
                fill
                onClick={() => setShowInvitationForm({ show: true, showMessageOnly: true, existingEmail: invitee })}
              >
                <TextWS>{invitee}</TextWS>
              </Box>
              <Box align="end" fill>
                <Trash
                  data-testid={`${invitee}-trash-icon`}
                  color="accent-1"
                  onClick={() => handleRemoveInvitee(invitee)}
                  cursor="grab"
                />
              </Box>
            </Box>
          );
        });
      }
    }
  };

  return (
    <CollapsiblePanelBox open title="Invitations">
      <Box
        data-testid="invitations-box"
        fill="horizontal"
        justify="start"
        align="center"
        gap="12px"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        {renderInvitations()}
        <ButtonWS
          label="INVITE PLAYER"
          primary
          margin={{ top: '12px' }}
          size="large"
          alignSelf="center"
          fill="horizontal"
          onClick={() => setShowInvitationForm({ show: true, showMessageOnly: false, existingEmail: '' })}
        />
      </Box>
    </CollapsiblePanelBox>
  );
};

export default InvitationsBox;
