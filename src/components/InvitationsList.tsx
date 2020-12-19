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
  const { id: userId, username: displayName, email } = useKeycloakUser();
  const [addUserToGame, { loading }] = useMutation<AddUserToGameData, AddUserToGameVars>(ADD_USER_TO_GAME);

  console.log('games', games);

  const handleJoinGame = async (gameId: string) => {
    // @ts-ignore
    await addUserToGame({ variables: { userId, displayName, email, gameId }, skip: !userId });
    history.push(`/new-game/${gameId}`, { role: Roles.player });
  };

  const getPlayersString = (game: Game) => {
    let string = 'with ';
    if (game.players.length === 0) {
      string += `${game.mc.displayName}`;
    }
    if (game.players.length === 1) {
      string += `${game.mc.displayName} `;
    } else if (game.players.length > 1) {
      string += `${game.mc.displayName}, `;
    }

    game.players.forEach((player, index) => {
      if (game.players.length === index + 1) {
        string += `and ${player.displayName}`;
      } else {
        string += `${player.displayName}, `;
      }
    });
    return string;
  };

  return (
    <Box>
      {games.map((game) => {
        return (
          <Box key={game.id} direction="row" justify="between" align="center">
            <Box direction="column" fill="horizontal">
              <Text weight="bold" size="xlarge" truncate>
                {game.name}
              </Text>
              <Text size="small" truncate>
                {getPlayersString(game)}
              </Text>
            </Box>
            <Button secondary onClick={() => handleJoinGame(game.id)} disabled={loading} focusIndicator={false}>
              {loading ? <Spinner fillColor="#FFF" /> : 'JOIN'}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default InvitationsList;
