import React, { useEffect } from 'react';
import { Button, Box, Image, Heading, Text } from 'grommet';
import styled from 'styled-components';
import generateRandomString from '../utils/generateRandomString';
import { DISCORD_CLIENT_ID } from '../config/discordConfig';
import { requestToken } from '../services/discordService';

const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/cover-background.jpg)',
};

const ButtonsContainer = styled.div`
  position: absolute;
  bottom: calc(4vh + 2px);
  min-width: 172px;
  width: 25vw;
  max-width: 300px;
  left: 15vw;
`;

const TitleContainer = styled.div`
  position: absolute;
  bottom: 4vh;
  min-width: 172px;
  width: 25vw;
  max-width: 300px;
  right: 15vw;
`;

export const getDiscordUrl = () => {
  let url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify`;
  const state = localStorage.getItem('stateParameter');
  if (!!state) {
    url += `&state=${btoa(state)}`;
  }
  return url;
};

const LandingPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    let returnedState = params.get('state') || '';
    returnedState = atob(decodeURIComponent(returnedState));
    const localState = localStorage.getItem('stateParameter');
    const accessToken = localStorage.getItem('access_token');
    if (!!returnedState && returnedState !== localState) {
      console.warn('You may have been click-jacked');
      // Handle secrity breach here
      return;
    }
    if (!!code && !!returnedState && !accessToken) {
      getDiscordToken(code);
    }
  }, []);

  // TODO: use a session id rather than a random string for the state parameter
  useEffect(() => {
    const currentState = localStorage.getItem('stateParameter');
    if (!currentState) {
      const randStr = generateRandomString();
      localStorage.setItem('stateParameter', randStr);
    }
  }, []);

  const getDiscordToken = async (code: string) => {
    const response = await requestToken(code);
    if (!!response && response.status === 200) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('expires_in', response.data.expires_in);
    }
  };

  return (
    <Box fill background={background}>
      <ButtonsContainer>
        <Box>
          <Heading level={1} margin={{ vertical: 'small' }} size="small">
            Log in with Discord
          </Heading>
          <Button label="LOG IN" primary size="large" alignSelf="center" fill href={getDiscordUrl()} />
          <Text color="accent-1" margin={{ top: 'xsmall' }}>
            You'll need a Discord account to rock the apocalypse with us
          </Text>
        </Box>
      </ButtonsContainer>
      <TitleContainer>
        <Box>
          <Image
            fit="contain"
            fill={true}
            src="images/cover-title.png"
            alt="D. Vincent Baker & Meguey Baker Apocalypse World"
          />
        </Box>
      </TitleContainer>
    </Box>
  );
};

export default LandingPage;
