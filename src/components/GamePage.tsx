import React from 'react';
import { AWCENTRAL_GUILD_ID } from '../services/discordService';
import { useGame } from '../contexts/gameContext';
import { Roles } from '../@types/enums';
import PlayerPage from './PlayerPage';
import MCPage from './MCPage';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import GAME_BY_TEXT_CHANNEL_ID from '../queries/gameByTextChannelId';

const GamePage = () => {
  const { gameID: textChannelId} = useParams<{ gameID: string}>()

  const { data: game, loading} = useQuery(GAME_BY_TEXT_CHANNEL_ID, {variables: {textChannelId}})
  console.log('loading', loading)
  console.log('game', game)

  const userRole = Roles.mc;
  console.log(`Game name: ${game?.name}`);
  console.log(`Discord text chat: https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.textChannelId}`);
  console.log(`Discord voice chat: https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.voiceChannelId}`);

  if (userRole === Roles.mc) {
    return <MCPage />;
  } else {
    return <PlayerPage />;
  }
};

export default GamePage;
