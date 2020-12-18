import { Box, Form, FormField, Heading, Paragraph, TextInput, Button, TextArea } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { EMAIL_REGEX } from '../config/constants';
import ActionButtons from './ActionButtons';
import { ShowInvitation } from './MCPage';

interface InvitationFormProps {
  gameName: string;
  gameId: string;
  handleAddInvitee: (email: string) => void;
  setShowInvitationForm: (showInvitation: ShowInvitation) => void;
  existingEmail?: string;
  showMessageOnly?: boolean;
}

const InvitationForm: FC<InvitationFormProps> = ({
  gameName,
  gameId,
  handleAddInvitee,
  setShowInvitationForm,
  existingEmail = '',
  showMessageOnly,
}) => {
  const [formValues, setFormValues] = useState<{ email: string }>({ email: existingEmail });
  const [message, setMessage] = useState(existingEmail);
  const [hasSubmitted, setHasSubmitted] = useState(showMessageOnly);

  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = message;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const validateEmail = (value: string) => {
    if (typeof value === 'undefined' || value.length === 0) {
      return '';
    }

    if (!EMAIL_REGEX.test(value)) {
      return '';
    } else {
      return value;
    }
  };

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

  useEffect(() => {
    const defaultMessage = `Hi. You've been invited to an Apocalypse World game called ${gameName}. We're using AW Central to manage playbooks, dice rolls etc.\n\nYou can join the game on AW Central at this url:\n\nhttps://www.aw-central.com/player-game/${gameId}\n\nYou'll need to log in (or register) with ${formValues.email}.\n\n`;
    hasSubmitted && setMessage(defaultMessage);
  }, [hasSubmitted, gameName, gameId, formValues, setMessage]);

  return (
    <Box pad="24px">
      <Heading level={2}>{`Invite a player to ${gameName}`}</Heading>
      {hasSubmitted ? (
        <Box animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <Paragraph>
            Let your player know how to join your game. You can edit the instructions below (if you want) and then copy and
            paste into an email, Discord chat etc.
          </Paragraph>
          <Box pad="12px" background="#CCCCCC" width="432px">
            {renderMessage()}
            <Button margin={{ top: '12px' }} secondary fill onClick={() => copyToClipboard()}>
              COPY TO CLIPBOARD
            </Button>
          </Box>
          <Box direction="row" justify="end" gap="24px" pad={{ top: '24px' }}>
            <Button
              label="CLOSE"
              onClick={() => setShowInvitationForm({ show: false, showMessageOnly: false, existingEmail: '' })}
            />
            <Button
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
          <Paragraph>First, add the player's email address to the game</Paragraph>
          <Form
            value={formValues}
            onChange={(nextValue) => setFormValues(nextValue)}
            onReset={() => setFormValues({ email: '' })}
            onSubmit={() => {
              handleAddInvitee(formValues.email);
              setHasSubmitted(true);
            }}
          >
            <FormField name="email" width="100%">
              <TextInput placeholder="Type player's email" type="email" name="email" size="xlarge" />
            </FormField>
            <ActionButtons value={validateEmail(formValues.email)} primaryLabel="ADD" />
          </Form>
        </Box>
      )}
    </Box>
  );
};

export default InvitationForm;
