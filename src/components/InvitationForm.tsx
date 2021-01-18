import React, { FC, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Mail } from 'grommet-icons';
import { Box, Form, FormField, TextInput, TextArea } from 'grommet';

import CloseButton from './CloseButton';
import { accentColors, ButtonWS, HeadingWS, ParagraphWS } from '../config/grommetConfig';
import ADD_INVITEE, { AddInviteeData, AddInviteeVars } from '../mutations/addInvitee';
import { useGame } from '../contexts/gameContext';
import { useFonts } from '../contexts/fontContext';
import { copyToClipboard } from '../helpers/copyToClipboard';
import { validateEmail } from '../helpers/validateEmail';

interface InvitationFormProps {
  handleClose: () => void;
  existingEmail?: string;
  showMessageOnly?: boolean;
}

const baseUrl = process.env.REACT_APP_ROOT_URL;

const InvitationForm: FC<InvitationFormProps> = ({ handleClose, existingEmail = '', showMessageOnly }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [formValues, setFormValues] = useState<{ email: string }>({ email: existingEmail });
  const [message, setMessage] = useState(existingEmail);
  const [hasSubmitted, setHasSubmitted] = useState(showMessageOnly);
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game } = useGame();
  const { crustReady } = useFonts();
  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [addInvitee] = useMutation<AddInviteeData, AddInviteeVars>(ADD_INVITEE);
  // ------------------------------------------------ Component functions -------------------------------------------------- //
  const handleAddInvitee = (email: string) => {
    if (validateEmail(email) && !game?.invitees.includes(email)) {
      addInvitee({ variables: { gameId, email } });
    }
  };

  // ------------------------------------------------------ Effects -------------------------------------------------------- //
  useEffect(() => {
    const defaultMessage = `Hi. Please join our Apocalypse World game on AW Central.\n\n- Go to ${baseUrl}/join-game\n- Log in (or register) with ${formValues.email}\n- Join the game called ${game?.name}`;
    hasSubmitted && setMessage(defaultMessage);
  }, [hasSubmitted, game, gameId, formValues, setMessage]);

  // ------------------------------------------------------- Render -------------------------------------------------------- //

  const renderMessage = () => {
    return (
      <TextArea
        resize={false}
        style={{ height: '33vh', borderRadius: 'unset' }}
        fill
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    );
  };

  return (
    <Box data-testid="invitation-form" pad="12px">
      <CloseButton handleClose={handleClose} />
      <HeadingWS
        crustReady={crustReady}
        level={2}
        margin={{ horizontal: '0px', bottom: '6px', top: '12px' }}
      >{`Invite a player to ${game?.name}`}</HeadingWS>
      {hasSubmitted ? (
        <Box width="520px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <ParagraphWS fill margin="6px">
            Let your player know how to join your game. You can edit the instructions below (if you want) and then copy and
            paste into an email, Discord chat etc.
          </ParagraphWS>
          <Box border={{ color: accentColors[0] }} pad="12px" background="transparent" gap="12px">
            {renderMessage()}
            <ButtonWS fill="horizontal" secondary label="COPY TO CLIPBOARD" onClick={() => copyToClipboard(message)} />
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
      ) : (
        <Box animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <ParagraphWS margin="6px">First, add the player's email address to the game</ParagraphWS>
          <Form
            value={formValues}
            onChange={(nextValue: any) => setFormValues(nextValue)}
            onReset={() => setFormValues({ email: '' })}
            onSubmit={() => {
              handleAddInvitee(formValues.email);
              setHasSubmitted(true);
            }}
          >
            <Box>
              <FormField name="email" width="100%">
                <TextInput placeholder="Type player's email" type="email" name="email" size="xlarge" icon={<Mail />} />
              </FormField>
              <ButtonWS type="submit" primary label="ADD" alignSelf="end" disabled={!formValues.email} />
            </Box>
          </Form>
        </Box>
      )}
    </Box>
  );
};

export default InvitationForm;
