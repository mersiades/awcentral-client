import React from 'react';
import { getGuild } from '../services/discordService';

const GamePage = () => {
  return <button onClick={() => getGuild()}>Get Guild</button>;
};

export default GamePage;
