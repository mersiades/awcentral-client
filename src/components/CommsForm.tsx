import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Box, FormField, TextInput, Button, Select, Heading, Paragraph, Text, TextArea, ThemeContext } from 'grommet';

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

  const renderOption = (option: string) => {
    return (
      <Box pad="xsmall">
        <Text style={{ fontFamily: 'chaparral pro' }}>{option}</Text>
      </Box>
    );
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
      <Box width="65vw" height="70vh" align="center" direction="column" justify="start" overflow="auto">
        <Heading level={2}>COMMS</Heading>
        <Box direction="row" justify="evenly" gap="48px" height="400px">
          <Box direction="column" fill="vertical">
            <Paragraph textAlign="center" size="large">
              How will you talk to your players?
            </Paragraph>
            <Paragraph textAlign="center" size="medium">
              AW Central can manage playbooks, threats, dice rolls etc, but you'll need to use some other app to talk with
              your players.
            </Paragraph>
            <Paragraph textAlign="center" size="medium">
              If you know your voice comms details, add them here to make it easier for your players to join you.
            </Paragraph>
          </Box>
          <Box direction="column" fill="vertical" justify="around">
            <Box direction="column">
              <Box gap="small" direction="row" justify="between">
                <Select
                  id="app-input"
                  name="app"
                  size="large"
                  options={appOptions}
                  value={app}
                  onChange={(e) => setApp(e.value)}
                  children={(option) => renderOption(option)}
                />

                {!!game.commsApp ? (
                  <Button
                    label="SET"
                    secondary
                    size="large"
                    alignSelf="center"
                    onClick={() => handleSetApp()}
                    disabled={!app}
                  />
                ) : (
                  <Button
                    label="SET"
                    primary
                    size="large"
                    alignSelf="center"
                    onClick={() => handleSetApp()}
                    disabled={!app}
                  />
                )}
              </Box>
              <Text color="neutral-1" margin={{ top: 'xsmall' }}>
                Video app to use
              </Text>
            </Box>
            <Box direction="column">
              <Box gap="small" direction="row" justify="between">
                <TextArea
                  id="url-input"
                  name="url"
                  size="large"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://"
                />

                {!!game.commsUrl ? (
                  <Button
                    label="SET"
                    secondary
                    size="large"
                    alignSelf="center"
                    onClick={() => handleSetUrl()}
                    disabled={!url}
                  />
                ) : (
                  <Button
                    label="SET"
                    primary
                    size="large"
                    alignSelf="center"
                    onClick={() => handleSetUrl()}
                    disabled={!url}
                  />
                )}
              </Box>
              <Text color="neutral-1" margin={{ top: 'xsmall' }}>
                Url to video chat group, meeting, channel etc
              </Text>
            </Box>
            {!!game.commsApp && !!game.commsUrl ? (
              <Button label="NEXT" primary size="large" alignSelf="end" onClick={() => setCreationStep(2)} />
            ) : (
              <Button label="LATER" size="large" alignSelf="end" onClick={() => setCreationStep(2)} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommsForm;
