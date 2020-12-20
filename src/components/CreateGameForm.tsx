import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { FormField, TextInput, Text, Button, Box, Form } from 'grommet';

import { useKeycloakUser } from '../contexts/keycloakUserContext';
// import { useWebsocketContext } from '../contexts/websocketContext';
import CREATE_GAME, { CreateGameData, CreateGameVars } from '../mutations/createGame';
import GAMEROLES_BY_USER_ID from '../queries/gameRolesByUserId';
// import { GameRequestBody } from '../@types';
// import { WebsocketRequests } from '../@types/enums';
// import { GameRequest, GameResponse } from '../@types';
// import { WebsocketRequests } from '../@types/enums';

const CreateGameForm: FC = () => {
  const [gameName, setGameName] = useState({ name: '' });
  const { id: userId, username: displayName, email } = useKeycloakUser();
  // const { stompClient, handleGame } = useWebsocketContext();
  const [createGame] = useMutation<CreateGameData, CreateGameVars>(CREATE_GAME);
  const history = useHistory();

  const sendNewGameRequest = async (userId: string, name: string) => {
    // Tell awcentral-api to create a new game
    const { data: newGame } = await createGame({
      // @ts-ignore
      variables: { userId, name, displayName, email },
      skip: !displayName || !email,
      refetchQueries: [{ query: GAMEROLES_BY_USER_ID, variables: { id: userId } }],
    });

    const gameId = newGame?.createGame.id;

    if (!!gameId) {
      history.push(`/create-game/${gameId}`);
    }
  };

  return (
    <Form
      value={gameName}
      onChange={(nextName) => setGameName(nextName)}
      onReset={() => setGameName({ name: '' })}
      onSubmit={async ({ value: { name } }: any) => !!userId && sendNewGameRequest(userId, name)}
    >
      <Box gap="small">
        <FormField name="name" label="Game name" htmlFor="text-input-id">
          <TextInput id="text-input-id" name="name" size="xxlarge" />
        </FormField>
        <Text color="accent-1" margin={{ top: 'xsmall' }}>
          Create a game with you as the MC. Then invite your players
        </Text>
        <Button type="submit" label="SUBMIT" primary size="large" alignSelf="center" fill />
      </Box>
    </Form>
  );
};

export default CreateGameForm;
