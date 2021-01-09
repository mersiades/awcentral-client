import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { FormField, TextInput, Box, Form } from 'grommet';

import Spinner from './Spinner';
import { ButtonWS, TextWS } from '../config/grommetConfig';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import CREATE_GAME, { CreateGameData, CreateGameVars } from '../mutations/createGame';
import GAMEROLES_BY_USER_ID from '../queries/gameRolesByUserId';

const CreateGameForm: FC = () => {
  const [gameName, setGameName] = useState({ name: '' });
  const { id: userId, username: displayName, email } = useKeycloakUser();
  const [createGame, { loading: loadingCreateGame }] = useMutation<CreateGameData, CreateGameVars>(CREATE_GAME);
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
      onChange={(nextName: any) => setGameName(nextName)}
      onReset={() => setGameName({ name: '' })}
      onSubmit={async ({ value: { name } }: any) => !!userId && !loadingCreateGame && sendNewGameRequest(userId, name)}
    >
      <Box gap="small">
        <FormField name="name" label="Name" htmlFor="text-input-id">
          <TextInput id="text-input-id" name="name" size="xlarge" placeholder={`${displayName}'s game`} />
        </FormField>
        <TextWS color="accent-1" margin={{ top: 'xsmall' }}>
          Create a game with you as the MC
        </TextWS>
        <ButtonWS
          type="submit"
          label={loadingCreateGame ? <Spinner fillColor="#FFF" fillHorizontal /> : 'SUBMIT'}
          primary
          size="large"
          alignSelf="center"
          fill
        />
      </Box>
    </Form>
  );
};

export default CreateGameForm;
