import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Box, Select, TextArea, TextInput } from 'grommet';

import CloseButton from './CloseButton';
import Spinner from './Spinner';
import { ButtonWS } from '../config/grommetConfig';
import ADD_COMMS_APP, { AddCommsAppData, AddCommsAppVars } from '../mutations/addCommsApp';
import ADD_COMMS_URL, { AddCommsUrlData, AddCommsUrlVars } from '../mutations/addCommsUrl';
import SET_GAME_NAME, { SetGameNameData, SetGameNameVars } from '../mutations/setGameName';
import { useGame } from '../contexts/gameContext';

interface GameFormProps {
  handleClose: () => void;
}

const GameForm: FC<GameFormProps> = ({ handleClose }) => {
  const { game } = useGame();

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [app, setApp] = useState(game?.commsApp || '');
  const [url, setUrl] = useState(game?.commsUrl || 'https://');
  const [name, setName] = useState(game?.name || '');

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [addCommsApp, { loading: settingApp }] = useMutation<AddCommsAppData, AddCommsAppVars>(ADD_COMMS_APP, {
    variables: { gameId, app },
  });
  const [addCommsUrl, { loading: settingUrl }] = useMutation<AddCommsUrlData, AddCommsUrlVars>(ADD_COMMS_URL, {
    variables: { gameId, url },
  });

  const [setGameName, { loading: settingName }] = useMutation<SetGameNameData, SetGameNameVars>(SET_GAME_NAME, {
    variables: { gameId, name },
  });

  // ------------------------------------------------ Component functions -------------------------------------------------- //
  const appOptions = ['Discord', 'Zoom', 'Skype', 'FaceTime', 'WhatsApp', 'Google Hangouts', 'Talky', 'ooVoo', 'other'];

  const handleSetApp = () => {
    if (!!app && !!game) {
      try {
        addCommsApp({ variables: { gameId, app } });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSetUrl = () => {
    if (!!url && !!game) {
      try {
        addCommsUrl({ variables: { gameId, url } });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSetName = () => {
    if (!!name && !!game) {
      try {
        setGameName({ variables: { gameId, name } });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // ------------------------------------------------------ Effects -------------------------------------------------------- //
  // ------------------------------------------------------- Render -------------------------------------------------------- //
  if (!game) {
    return <Spinner />;
  }

  console.log('name', name);
  return (
    <Box
      align="start"
      height="500px"
      width="520px"
      direction="column"
      justify="around"
      overflow="auto"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <CloseButton handleClose={handleClose} />
      <Box gap="12px" width="100%" direction="row" justify="between">
        <TextInput
          id="text-input-id"
          value={name}
          name="name"
          size="xlarge"
          placeholder={game.name}
          onChange={(e) => setName(e.target.value)}
        />
        <ButtonWS
          label="SET"
          primary
          size="large"
          alignSelf="center"
          onClick={() => handleSetName()}
          disabled={!name || settingName}
        />
      </Box>
      <Box gap="12px" width="100%" direction="row" justify="between">
        <Select
          id="app-input"
          name="app"
          placeholder="App"
          options={appOptions}
          value={app}
          onChange={(e) => setApp(e.value)}
        />
        <ButtonWS
          label="SET"
          primary
          size="large"
          alignSelf="center"
          onClick={() => handleSetApp()}
          disabled={!app || settingApp}
        />
      </Box>
      <Box fill="horizontal" gap="small" justify="between">
        <TextArea
          id="url-input"
          name="url"
          size="large"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          style={{ height: '100px' }}
        />

        <ButtonWS
          alignSelf="end"
          label="SET"
          primary
          size="large"
          onClick={() => handleSetUrl()}
          disabled={!url || settingUrl}
        />
      </Box>
    </Box>
  );
};

export default GameForm;
