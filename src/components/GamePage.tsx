import React from 'react';
import { AWCENTRAL_GUILD_ID } from '../services/discordService';
import { useGame } from '../contexts/gameContext';
import { Roles } from '../@types/enums';
import PlayerPage from './PlayerPage';
import MCPage from './MCPage';

const GamePage = () => {
  const { game } = useGame();
  const userRole = Roles.mc;
  console.log(`Game name: ${game?.name}`);
  console.log(`Discord text chat: https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.textChannelID}`);
  console.log(`Discord voice chat: https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.voiceChannelID}`);

  if (userRole === Roles.mc) {
    return <MCPage />;
  } else {
    return <PlayerPage />;
  }
};

export default GamePage;
