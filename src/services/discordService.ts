import axios, { AxiosRequestConfig } from 'axios';
import Discord, { Client, GuildChannel, GuildMember, Guild, GuildCreateChannelOptions } from 'discord.js';
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
  console.log('guild', guild);
};

export const createTextChannel = (gameName: string) => {
  return client.guilds.cache.get(AWCENTRAL_GUILD_ID)?.channels.create(gameName);
};

export const setTextChannelPermissions = (textChannel: GuildChannel, memberID: string) => {
  const guild = client.guilds.cache.get(AWCENTRAL_GUILD_ID) as Guild;
  const member = guild.members.cache.get(memberID) as GuildMember;
  textChannel.updateOverwrite(textChannel.guild.roles.everyone, {
    VIEW_CHANNEL: false,
    SEND_MESSAGES: false,
    SEND_TTS_MESSAGES: false,
  });
  textChannel.updateOverwrite(member.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
};

export const setVoiceChannelPermissions = (voiceChannel: GuildChannel, memberID: string) => {
  const guild = client.guilds.cache.get(AWCENTRAL_GUILD_ID) as Guild;
  const member = guild.members.cache.get(memberID) as GuildMember;
  voiceChannel.updateOverwrite(voiceChannel.guild.roles.everyone, {
    VIEW_CHANNEL: false,
    SEND_MESSAGES: false,
    SEND_TTS_MESSAGES: false,
    CONNECT: false,
    SPEAK: false,
  });
  voiceChannel.updateOverwrite(member.user.id, {
    VIEW_CHANNEL: true,
    SEND_MESSAGES: true,
    PRIORITY_SPEAKER: true,
    CONNECT: true,
    SPEAK: true,
    MUTE_MEMBERS: true,
  });
};

export const createVoiceChannel = (gameName: string) => {
  const options: GuildCreateChannelOptions = {
    type: 'voice',
    bitrate: 64000, // 64kbps
    userLimit: 9,
  };
  return client.guilds.cache.get(AWCENTRAL_GUILD_ID)?.channels.create(`${gameName}-voice`, options);
};

export const getDiscordUser = () => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: getAuthHeader(),
    },
  };

  return axios.get('https://discordapp.com/api/users/@me', config);
};

client.login(DISCORD_BOT_TOKEN);
