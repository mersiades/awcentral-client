import React, { FC, useState } from 'react';
import { FormField, TextInput, Text, Button, Box, Form } from 'grommet';

const CreateGameForm: FC = () => {
  const [gameName, setGameName] = useState({ name: '' });
  return (
    <Form
      value={gameName}
      onChange={(nextName) => setGameName(nextName)}
      onReset={() => setGameName({ name: '' })}
      onSubmit={({ value }: any) => {
        console.log('value', value);
        // Create game on server, save returned data to GameContext
        // const channel = createChannel(value.name)
        // Create a Discord channel for the game
        // Add this game creator to the Discord channel
        // Navigate to MCPage
      }}
    >
      <Box gap="small">
        <FormField name="name" label="Game name" htmlFor="text-input-id">
          <TextInput id="text-input-id" placeholder="Enter name" name="name" />
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
