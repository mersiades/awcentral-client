import React, { FC, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Form, Box, FormField, TextInput, TextArea } from 'grommet';

import { ButtonWS, HeadingWS, ParagraphWS } from '../config/grommetConfig';
import ADD_INVITEE, { AddInviteeData, AddInviteeVars } from '../mutations/addInvitee';
import { Game } from '../@types';
import { copyToClipboard } from '../helpers/copyToClipboard';
import { validateEmail } from '../helpers/validateEmail';
import { BASE_URL } from '../config/constants';

interface InviteesFormProps {
  game: Game;
}

const InviteesForm: FC<InviteesFormProps> = ({ game }) => {
  // ------------------------------------------------- Component state --------------------------------------------------- //
  const [formValues, setFormValues] = useState<{ email: string }>({ email: '' });
  const [message, setMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const history = useHistory();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const [addInvitee] = useMutation<AddInviteeData, AddInviteeVars>(ADD_INVITEE);

  // ---------------------------------------- Component functions and variables ------------------------------------------ //

  const renderMessage = () => {
    return (
      <TextArea
        resize={false}
        style={{ height: '15vh', borderRadius: 'unset' }}
        fill
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    );
  };

  const handleAddInvitee = (email: string) => {
    if (!game?.invitees.includes(email)) {
      addInvitee({ variables: { gameId: game.id, email } });
    }
  };

  useEffect(() => {
    const defaultMessage = `Hi. Please join our Apocalypse World game on AW Central.\n\n- Go to ${BASE_URL}/join-game\n- Log in (or register) with ${formValues.email}\n- Join the game called ${game.name}`;
    hasSubmitted && setMessage(defaultMessage);
  }, [hasSubmitted, game.name, game.id, formValues, setMessage]);

  return (
    <Box
      direction="column"
      fill
      align="center"
      justify="center"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Box width="50vw" height="70vh" align="center" direction="column" justify="start" overflow="auto">
        <HeadingWS level={1}>INVITE PLAYERS</HeadingWS>
        {hasSubmitted ? (
          <Box
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
            direction="column"
            align="center"
            width="100%"
          >
            <ParagraphWS>
              Let your player know how to join your game. You can edit the instructions below (if you want) and then copy and
              paste into an email, Discord chat etc.
            </ParagraphWS>
            <Box pad="12px" background="#CCCCCC" width="100%">
              {renderMessage()}
              <Box direction="row" width="100%" justify="between" gap="12px" margin={{ top: '12px' }}>
                <ButtonWS secondary label="COPY TO CLIPBOARD" onClick={() => copyToClipboard(message)} />
                <ButtonWS
                  primary
                  label="INVITE ANOTHER"
                  onClick={() => {
                    setFormValues({ email: '' });
                    setHasSubmitted(false);
                  }}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box fill="horizontal" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
            <ParagraphWS>First, add the player's email address to the game</ParagraphWS>
            <Form
              value={formValues}
              onChange={(nextValue: any) => setFormValues(nextValue)}
              onReset={() => setFormValues({ email: '' })}
              onSubmit={() => {
                handleAddInvitee(formValues.email);
                setHasSubmitted(true);
              }}
            >
              <Box gap="small" direction="row" justify="between" align="center">
                <FormField name="email" width="100%">
                  <TextInput placeholder="Type player's email" type="email" name="email" size="xlarge" />
                </FormField>
                {game.invitees.length === 0 ? (
                  <ButtonWS
                    type="submit"
                    primary
                    value={validateEmail(formValues.email)}
                    label="ADD"
                    disabled={!formValues.email}
                  />
                ) : (
                  <ButtonWS
                    type="submit"
                    secondary
                    value={validateEmail(formValues.email)}
                    label="ADD"
                    disabled={!formValues.email}
                  />
                )}
              </Box>
            </Form>
          </Box>
        )}
        <Box
          animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          fill="horizontal"
          direction="row"
          justify="end"
          margin={{ top: '12px' }}
        >
          {game.invitees.length === 0 ? (
            <ButtonWS
              type="submit"
              value={validateEmail(formValues.email)}
              label="LATER"
              onClick={() => history.push(`/mc-game/${game.id}`)}
            />
          ) : (
            <ButtonWS
              type="submit"
              value={validateEmail(formValues.email)}
              label="FINISH"
              onClick={() => history.push(`/mc-game/${game.id}`)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default InviteesForm;
