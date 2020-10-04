import { List } from 'grommet';
import React, { FC } from 'react';
import { GameRole } from '../@types';
import { Roles } from '../@types/enums';
import { getDefaultAvatar } from '../services/discordService';

interface GamesListProps {
  gameRoles: GameRole[];
}

const GamesList: FC<GamesListProps> = ({ gameRoles }) => {
  const transformGames = () => {
    const games: { name: string; role: Roles; gameId: string }[] = [];
    gameRoles.forEach((gameRole) => {
      const datum = {
        name: gameRole.game.name,
        role: gameRole.role,
        gameId: gameRole.game.textChannelID,
      };
      games.push(datum);
    });

    return games;
  };

  return <List primaryKey="name" secondaryKey="role" data={transformGames()} />;
};

export default GamesList;
