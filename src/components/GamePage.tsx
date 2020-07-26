import React from 'react';
import { AWCENTRAL_GUILD_ID } from '../services/discordService';
import { useGame } from '../contexts/gameContext';

const GamePage = () => {
  const { game } = useGame();
  return (
    <div>
      <h4>Game Page</h4>
      <p>{`Game id: ${game?.id}`}</p>
      <p>{`Game name: ${game?.name}`}</p>
      <a
        href={`https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.textChannelID}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Discord text chat
      </a>
      <br />
      <a
        href={`https://discord.com/channels/${AWCENTRAL_GUILD_ID}/${game?.voiceChannelID}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Discord voice chat
      </a>
    </div>
  );
};

export default GamePage;
