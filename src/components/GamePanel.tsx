import React, { FC } from 'react';
import { Box, Button, Text, Heading } from 'grommet';
import { Close, Edit, Trash } from 'grommet-icons';
import { Game } from '../@types';
import { Roles } from '../@types/enums';
import { useKeycloakUser } from '../contexts/keycloakUserContext';

interface GamePanelProps {
  game: Game;
  closePanel: (tab: number) => void;
  setShowDeleteGameDialog: (show: boolean) => void;
  setShowInvitationForm: (show: boolean) => void;
}

const GamePanel: FC<GamePanelProps> = ({ game, closePanel, setShowDeleteGameDialog, setShowInvitationForm }) => {
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

  return (
    <Box fill justify="between">
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
          <Button
            label="INVITE PLAYER"
            primary
            size="large"
            alignSelf="center"
            fill="horizontal"
            onClick={() => setShowInvitationForm(true)}
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
