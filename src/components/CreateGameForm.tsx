import React, { FC, useState } from 'react';
import { FormField, TextInput, Text, Button, Box, Form } from 'grommet';
import {
  createTextChannelWithMC,
  createVoiceChannelWithMC,
} from '../services/discordService';
import { useGame } from '../contexts/gameContext';
import { Game } from '../@types';
import { useDiscordUser } from '../contexts/discordUserContext';
import { useHistory } from 'react-router-dom';

const CreateGameForm: FC = () => {
  const [gameName, setGameName] = useState({ name: '' });
  const { setGame } = useGame();
  const { discordId } = useDiscordUser();
  const history = useHistory();
  
  return (
    <Form
      value={gameName}
      onChange={(nextName) => setGameName(nextName)}
      onReset={() => setGameName({ name: '' })}
      onSubmit={async ({ value }: any) => {
        console.log('value', value);
        if (!!discordId) {
          // Create game on server, save returned data to GameContext
          const textChannel = await createTextChannelWithMC(value.name, discordId);
          const voiceChannel = await createVoiceChannelWithMC(value.name, discordId);
          
          if (!!textChannel && !!voiceChannel) {
            // TODO: add mutation to create games
            // const game: Game = {
            //   name: value.name,
            //   textChannelID: textChannel.id,
            //   voiceChannelID: voiceChannel.id,
            // };

            // setGame(game);
            // history.push(`/game/${game.textChannelID}`);
          }
          // Create a Discord channel for the game
          // Add this game creator to the Discord channel
          // Navigate to MCPage
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
