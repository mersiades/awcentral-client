import { useMutation } from '@apollo/client';
import { Box, Button, Text } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Game } from '../@types';
import { Roles } from '../@types/enums';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import ADD_USER_TO_GAME, { AddUserToGameData, AddUserToGameVars } from '../mutations/addUserToGame';
import Spinner from './Spinner';

interface InvitationsListProps {
  games: Game[];
}

const InvitationsList: FC<InvitationsListProps> = ({ games }) => {
  const history = useHistory();
  const { id: userId } = useKeycloakUser();
  const [addUserToGame, { loading }] = useMutation<AddUserToGameData, AddUserToGameVars>(ADD_USER_TO_GAME);

  console.log('games', games);

  const handleJoinGame = async (gameId: string) => {
    // @ts-ignore
    await addUserToGame({ variables: { gameId, userId }, skip: !userId });
    history.push(`/new-game/${gameId}`, { role: Roles.player });
  };

  return (
    <Box>
      {games.map((game) => {
        return (
          <Box direction="row" justify="between" align="center">
            <Text weight="bold" size="xlarge">
              {game.name}
            </Text>
            <Button secondary onClick={() => handleJoinGame(game.id)} disabled={loading}>
              {loading ? <Spinner fillColor="#FFF" /> : 'JOIN'}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default InvitationsList;
