import axios, { AxiosRequestConfig } from 'axios';
import Discord, { Client } from 'discord.js';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN } from '../config/discordConfig';

const AWCENTRAL_GUILD_ID = '736768552161509406';

export const requestToken = async (code: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const formData = new FormData();
  formData.append('client_id', DISCORD_CLIENT_ID);
  formData.append('client_secret', DISCORD_CLIENT_SECRET);
  formData.append('grant_type', 'authorization_code');
  formData.append('redirect_uri', 'http://localhost:3000');
  formData.append('scope', 'identify');
  formData.append('code', code);

  return await axios.post('https://discordapp.com/api/oauth2/token', formData, config);
};

const client: Client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

export const getGuild = () => {
  const guild = client.guilds.cache.get(AWCENTRAL_GUILD_ID);
  console.log('guild', guild);
};

export const createChannel = (gameName: string) => {
  client.guilds.cache.get(AWCENTRAL_GUILD_ID)?.channels.create(gameName, { reason: 'New channel for a new awcentral game' });
};

client.login(DISCORD_BOT_TOKEN);
