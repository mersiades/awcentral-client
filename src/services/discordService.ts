import axios, { AxiosRequestConfig } from 'axios';
import Discord, { Client } from 'discord.js';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN } from '../config/discordConfig';
import { getAuthHeader } from '../helpers/getAuthHeader';

export const AWCENTRAL_GUILD_ID = '736768552161509406';

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
  formData.append('scope', 'identify email');
  formData.append('code', code);

  return await axios.post('https://discordapp.com/api/oauth2/token', formData, config);
};

const client: Client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

export const getGuild = () => {
  const guild = client.guilds.cache.get(AWCENTRAL_GUILD_ID);
  return guild
};

// Creates a text channel on Discord, with no permissions for 
export const createTextChannelWithMC = (gameName: string, mcDiscordId: string) => {
  console.log('mcDiscordId', mcDiscordId)
  const guild = getGuild()
  return guild?.channels.create(gameName, {
    type: 'text',
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: [
          'ADD_REACTIONS',
          'ATTACH_FILES',
          'CONNECT',
          'CREATE_INSTANT_INVITE',
          'EMBED_LINKS',
          'MENTION_EVERYONE',
          'READ_MESSAGE_HISTORY',
          'SEND_MESSAGES',
          'SEND_TTS_MESSAGES',
          'SPEAK',
          'STREAM',
          'USE_EXTERNAL_EMOJIS',
          "USE_VAD",
          'VIEW_CHANNEL',
        ]
      },
      {
        id: mcDiscordId,
        allow: [
          'ADD_REACTIONS',
          'ATTACH_FILES',
          'CONNECT',
          'CREATE_INSTANT_INVITE',
          'EMBED_LINKS',
          'MENTION_EVERYONE',
          'READ_MESSAGE_HISTORY',
          'SEND_MESSAGES',
          'SEND_TTS_MESSAGES',
          'SPEAK',
          'STREAM',
          'USE_EXTERNAL_EMOJIS',
          "USE_VAD",
          'VIEW_CHANNEL',
        ]
      }
    ]
  });
};

export const createVoiceChannelWithMC = (gameName: string, mcDiscordId: string) => {
  const guild = getGuild()
  return guild?.channels.create(`${gameName}-voice`, {
    type: 'voice',
    bitrate: 64000, // 64kbps
    userLimit: 9,
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: [
          'ADD_REACTIONS',
          'ATTACH_FILES',
          'CHANGE_NICKNAME',
          'CONNECT',
          'CREATE_INSTANT_INVITE',
          'EMBED_LINKS',
          'MENTION_EVERYONE',
          'READ_MESSAGE_HISTORY',
          'SEND_MESSAGES',
          'SEND_TTS_MESSAGES',
          'SPEAK',
          'STREAM',
          'USE_EXTERNAL_EMOJIS',
          "USE_VAD",
          'VIEW_CHANNEL',
        ]
      },
      {
        id: mcDiscordId,
        allow: [
          'ADD_REACTIONS',
          'ATTACH_FILES',
          'CHANGE_NICKNAME',
          'CONNECT',
          'CREATE_INSTANT_INVITE',
          'EMBED_LINKS',
          'MENTION_EVERYONE',
          'READ_MESSAGE_HISTORY',
          'SEND_MESSAGES',
          'SEND_TTS_MESSAGES',
          'SPEAK',
          'STREAM',
          'USE_EXTERNAL_EMOJIS',
          "USE_VAD",
          'VIEW_CHANNEL',
        ]
      },
    ]
  });
};


export const getDiscordUser = () => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: getAuthHeader(),
    },
  };

  return axios.get('https://discordapp.com/api/users/@me', config);
};

export const getUserAvatar = (userId: string, hash: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: getAuthHeader(),
    },
  };

  return axios.get(`https://cdn.discordapp.com/${userId}/${hash}.png`, config);
};

export const getDefaultAvatar = (discriminator: number) => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: getAuthHeader(),
    },
  };
  return axios.get(`https://cdn.discordapp.com/embed/avatars/${discriminator % 5}.png`, config);
};

client.login(DISCORD_BOT_TOKEN);
