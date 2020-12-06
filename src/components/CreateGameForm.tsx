import React, { FC, useState } from 'react';
import { FormField, TextInput, Text, Button, Box, Form } from 'grommet';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { useWebsocketContext } from '../contexts/websocketContext';
import CREATE_GAME, { CreateGameData, CreateGameVars } from '../mutations/createGame';
// import { GameRequestBody } from '../@types';
// import { WebsocketRequests } from '../@types/enums';
import { useMutation } from '@apollo/client';
import { GameRequest, GameResponse } from '../@types';
import { WebsocketRequests } from '../@types/enums';
import { useHistory } from 'react-router-dom';

const CreateGameForm: FC = () => {
  const [gameName, setGameName] = useState({ name: '' });
  const { id: userId } = useKeycloakUser();
  const { stompClient, handleGame } = useWebsocketContext();
  const [createGame] = useMutation<CreateGameData, CreateGameVars>(CREATE_GAME);
  const history = useHistory();

  const sendNewGameRequest = async (userId: string, name: string) => {
    // Tell awcentral-api to create a new game
    const { data: newGame } = await createGame({
      variables: { userId, name },
    });

    const gameId = newGame?.createGame.id;

    if (!!gameId) {
      history.push(`/mc-game/${gameId}`);
    }

    // if (!!newGame && !!stompClient && !!handleGame) {
    //   // Subscribe to a awc-bot websocket channel for the new game
    //   const gameId = newGame.createGame.id;
    //   stompClient?.subscribe(`/topic/game/${gameId}`, (payload) => handleGame(JSON.parse(payload.body) as GameResponse));

    //   // Tell awc-bot to create Discord channels for the new game
    //   const destination = `/app/game/${gameId}`;
    //   const addChannelsRequest: GameRequest = { type: WebsocketRequests.addChannels, id: gameId, userId, name };
    //   const body = JSON.stringify(addChannelsRequest);
    //   stompClient.publish({ destination, body });
    // }
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
          <TextInput id="text-input-id" name="name" />
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
