import React, { FC, useState } from 'react';
import { FormField, TextInput, Text, Button, Box, Form } from 'grommet';
import {
  createTextChannelWithMC,
  createVoiceChannelWithMC,
} from '../services/discordService';
import { useDiscordUser } from '../contexts/discordUserContext';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import CREATE_GAME from '../mutations/createGame';
import USER_BY_DISCORD_ID from '../queries/userByDiscordId';

const CreateGameForm: FC = () => {
  const [gameName, setGameName] = useState({ name: '' });
  const { discordId } = useDiscordUser();
  const [createGame ] = useMutation(CREATE_GAME)
  const history = useHistory();
  
  return (
    <Form
      value={gameName}
      onChange={(nextName) => setGameName(nextName)}
      onReset={() => setGameName({ name: '' })}
      onSubmit={async ({ value }: any) => {
        if (!!discordId) {

          // Create text and audio channels on Discord for the new game
          const textChannel = await createTextChannelWithMC(value.name, discordId);
          const voiceChannel = await createVoiceChannelWithMC(value.name, discordId);
          
          if (!!textChannel && !!voiceChannel) {
            await createGame({
              variables: {discordId, name: value.name, textChannelId: textChannel.id, voiceChannelId: voiceChannel.id},
              refetchQueries: [{ query: USER_BY_DISCORD_ID, variables: { discordId }}]
            })
            history.push(`/game/${textChannel.id}`);
          }
        }
      }}
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
