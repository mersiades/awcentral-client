import { Box, Form, FormField, Heading, Paragraph, TextInput, Text, Anchor, Button } from 'grommet';
import React, { FC, useState } from 'react';
import { EMAIL_REGEX } from '../config/constants';
import ActionButtons from './ActionButtons';

interface InvitationFormProps {
  gameName: string;
  gameId: string;
  setShowInvitationForm: (show: boolean) => void;
}

const InvitationForm: FC<InvitationFormProps> = ({ gameName, gameId, setShowInvitationForm }) => {
  const [formValues, setFormValues] = useState<{ email: string }>({ email: '' });
  const [hasSubmitted, setHasSubmitted] = useState(false);

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

  const renderMessage = () => (
    <>
      <Text>
        Hi. You've been invited to an Apocalypse World game called {gameName}. We're using AW Central to manage playbooks,
        dice rolls etc.
      </Text>
      <br />
      <Text>You can join the game on AW Central at this url:</Text>
      <Anchor href={`https://www.aw-central.com/player-game/${gameId}`} target="_blank" rel="noopener noreferrer">
        {gameName}
      </Anchor>
      <br />
      <Text>You'll need to log in (or register if you're new to AW Central) with {formValues.email}</Text>
    </>
  );

  return (
    <Box pad="24px">
      <Heading level={2}>{`Invite a player to ${gameName}`}</Heading>
      {hasSubmitted ? (
        <Box animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <Paragraph>
            Then, let the player know how to join the game. You can copy and paste the text below into an email, Discord chat
            etc.
          </Paragraph>
          <Box pad="12px" background="#CCCCCC" width="432px">
            {renderMessage()}
          </Box>
          <Box direction="row" justify="end" gap="24px" pad={{ top: '24px' }}>
            <Button label="CLOSE" onClick={() => setShowInvitationForm(false)} />
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
              console.log('submitting');
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
