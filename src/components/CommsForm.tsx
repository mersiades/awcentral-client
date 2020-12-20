import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Box, FormField, TextInput, Button, Select, Heading, Paragraph } from 'grommet';

import ADD_COMMS_APP, { AddCommsAppData, AddCommsAppVars } from '../mutations/addCommsApp';
import ADD_COMMS_URL, { AddCommsUrlData, AddCommsUrlVars } from '../mutations/addCommsUrl';
import { Game } from '../@types';

interface CommsFormProps {
  game: Game;
  setCreationStep: (step: number) => void;
}

const CommsForm: FC<CommsFormProps> = ({ game, setCreationStep }) => {
  // ------------------------------------------------- Component state --------------------------------------------------- //
  const [app, setApp] = useState(game.commsApp || '');
  const [url, setUrl] = useState(game.commsUrl || '');

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const [addCommsApp] = useMutation<AddCommsAppData, AddCommsAppVars>(ADD_COMMS_APP, {
    variables: { gameId: game.id, app },
  });
  const [addCommsUrl] = useMutation<AddCommsUrlData, AddCommsUrlVars>(ADD_COMMS_URL, {
    variables: { gameId: game.id, url },
  });

  // ---------------------------------------- Component functions and variables ------------------------------------------ //
  const appOptions = ['Discord', 'Zoom', 'Skype', 'FaceTime', 'WhatsApp', 'Google Hangouts', 'Talky', 'ooVoo', 'other'];

  const handleSetApp = () => {
    if (!!app) {
      try {
        addCommsApp({ variables: { gameId: game.id, app } });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSetUrl = () => {
    if (!!url) {
      try {
        addCommsUrl({ variables: { gameId: game.id, url } });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <Box
      direction="column"
      fill
      background="black"
      align="center"
      justify="center"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Box width="50vw" height="70vh" align="center" direction="column" justify="between" overflow="auto">
        <Heading level={1}>COMMS</Heading>
        <Paragraph textAlign="center" size="large">
          How will you talk to your players?
        </Paragraph>
        <Paragraph textAlign="center" size="medium">
          AW Central can manage playbooks, threats, dice rolls etc, but you'll need to use some other app to talk with your
          players.
        </Paragraph>
        <Box width="406px" gap="medium">
          <Box gap="small" direction="row" justify="between">
            <Select
              id="app-input"
              name="app"
              size="large"
              placeholder="App"
              options={appOptions}
              value={app}
              onChange={(e) => setApp(e.value)}
            />
            {!!game.commsApp ? (
              <Button label="SET" secondary size="large" alignSelf="center" onClick={() => handleSetApp()} disabled={!app} />
            ) : (
              <Button label="SET" primary size="large" alignSelf="center" onClick={() => handleSetApp()} disabled={!app} />
            )}
          </Box>
          <Paragraph textAlign="center" size="medium">
            Do you have a url to your video chat?
          </Paragraph>
          <Box gap="small" direction="row" justify="between">
            <FormField>
              <TextInput
                id="url-input"
                name="url"
                size="xlarge"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://"
              />
            </FormField>
            {!!game.commsUrl ? (
              <Button label="SET" secondary size="large" alignSelf="center" onClick={() => handleSetUrl()} disabled={!url} />
            ) : (
              <Button label="SET" primary size="large" alignSelf="center" onClick={() => handleSetUrl()} disabled={!url} />
            )}
          </Box>
          {!!game.commsApp && !!game.commsUrl ? (
            <Button label="NEXT" primary size="large" alignSelf="end" onClick={() => setCreationStep(2)} />
          ) : (
            <Button label="LATER" size="large" alignSelf="end" onClick={() => setCreationStep(2)} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CommsForm;
