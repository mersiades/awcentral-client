import React, { FC } from 'react';
import { Box, Button, Text, Heading } from 'grommet';
import { Close, Edit, Trash } from 'grommet-icons';
import { Game } from '../@types';
import { Roles } from '../@types/enums';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { ShowInvitation } from './MCPage';

interface GamePanelProps {
  game: Game;
  closePanel: (tab: number) => void;
  setShowDeleteGameDialog: (show: boolean) => void;
  setShowInvitationForm: (showInvitation: ShowInvitation) => void;
  handleRemoveInvitee: (email: string) => void;
}

const GamePanel: FC<GamePanelProps> = ({
  game,
  closePanel,
  setShowDeleteGameDialog,
  setShowInvitationForm,
  handleRemoveInvitee,
}) => {
  const { username } = useKeycloakUser();

  const renderPlayers = () => {
    if (game.gameRoles.filter((gameRole) => gameRole.role === Roles.player).length === 0) {
      return (
        <Box direction="row" align="center" alignContent="end" fill margin={{ vertical: 'small' }}>
          <Box align="start" fill>
            <Text>No players yet</Text>
          </Box>
        </Box>
      );
    } else {
      return game.gameRoles
        .filter((gameRole) => gameRole.role === Roles.player)
        .map((gameRole, index) => {
          if (!gameRole.characters || gameRole.characters.length === 0) {
            return (
              <Box key={index} direction="row" align="center" alignContent="end" fill margin={{ vertical: 'small' }}>
                <Box align="start" fill>
                  <Text>XXX has no character yet</Text>
                </Box>
              </Box>
            );
          } else {
            return gameRole.characters?.map((character) => (
              <Box
                key={character.name}
                direction="row"
                align="center"
                alignContent="end"
                fill
                margin={{ vertical: 'small' }}
              >
                <Box align="start" fill>
                  <Text>{character.name}</Text>
                </Box>
                <Box align="end" fill>
                  <Trash color="accent-1" onClick={() => console.log('clicked')} cursor="grab" />
                </Box>
              </Box>
            ));
          }
        });
    }
  };

  const renderInvitations = () => {
    if (game.invitees.length === 0) {
      return (
        <Box direction="row" align="center" alignContent="end" fill margin={{ vertical: 'small' }}>
          <Box align="start" fill>
            <Text>No pending invitations</Text>
          </Box>
        </Box>
      );
    } else {
      return game.invitees.map((invitee) => {
        return (
          <Box key={invitee} direction="row" align="center" alignContent="end" fill margin={{ vertical: 'small' }}>
            <Box
              align="start"
              fill
              onClick={() => setShowInvitationForm({ show: true, showMessageOnly: true, existingEmail: invitee })}
            >
              <Text>{invitee}</Text>
            </Box>
            <Box align="end" fill>
              <Trash color="accent-1" onClick={() => handleRemoveInvitee(invitee)} cursor="grab" />
            </Box>
          </Box>
        );
      });
    }
  };

  return (
    <Box fill justify="between" overflow="auto">
      <div>
        <Box fill="horizontal" align="end" pad="small" animation="fadeIn">
          <Close color="accent-1" onClick={() => closePanel(3)} cursor="grab" />
        </Box>
        <Box direction="row" fill="horizontal" justify="between" align="center" pad="small" animation="fadeIn">
          <Heading level={3}>{game ? game.name : 'Game name'}</Heading>
          <Edit color="accent-1" onClick={() => console.log('clicked')} cursor="grab" />
        </Box>
        <Box fill="horizontal" pad="small" animation="fadeIn">
          <Heading level={3}>MC</Heading>
          <Text>{!!username ? username : 'MC unknown'}</Text>
        </Box>
        <Box fill="horizontal" pad="small" animation="fadeIn">
          <Heading level={3}>Players</Heading>
          {renderPlayers()}
        </Box>
        <Box fill="horizontal" pad="small" animation="fadeIn">
          <Heading level={3}>Invitations</Heading>
          {renderInvitations()}
          <Button
            label="INVITE PLAYER"
            primary
            margin={{ top: '12px' }}
            size="large"
            alignSelf="center"
            fill="horizontal"
            onClick={() => setShowInvitationForm({ show: true, showMessageOnly: false, existingEmail: '' })}
          />
        </Box>
      </div>
      <div>
        <Box fill="horizontal" pad="small" animation="fadeIn">
          <Button
            label="DELETE GAME"
            secondary
            size="large"
            alignSelf="center"
            fill
            onClick={() => setShowDeleteGameDialog(true)}
          />
        </Box>
      </div>
    </Box>
  );
};

export default GamePanel;
