import React, { FC, useState } from 'react';
import { FormField, TextInput, Text, Button, Box, Form } from 'grommet';
import { useDiscordUser } from '../contexts/discordUserContext';
import { useWebsocketContext } from '../contexts/websocketContext';
import { NewGameRequestBody } from '../@types';

const CreateGameForm: FC = () => {
  const [gameName, setGameName] = useState({ name: '' });
  const { discordId } = useDiscordUser();
  const { stompClient } = useWebsocketContext();

  const sendNewGameRequest = (discordId: string, name: string) => {
    const destination = '/app/games'
    const newGameRequest: NewGameRequestBody = { discordId, name }
    const body = JSON.stringify(newGameRequest)
    stompClient?.publish({ destination, body })
  }
  
  return (
    <Form
      value={gameName}
      onChange={(nextName) => setGameName(nextName)}
      onReset={() => setGameName({ name: '' })}
      onSubmit={async ({ value: { name } }: any) => !!discordId && sendNewGameRequest(discordId, name)}
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
