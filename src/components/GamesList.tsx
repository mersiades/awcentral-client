import { List } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { GameRole } from '../@types';
import { Roles } from '../@types/enums';

interface GamesListProps {
  gameRoles: GameRole[];
}

interface GameInList {
  name: string;
  role: Roles;
  gameId: string
}

const GamesList: FC<GamesListProps> = ({ gameRoles }) => {
  const history = useHistory();
  // Transforms gameRoles to fit nicely with Grommet's List requirements
  const transformGames = () => {
    const games: GameInList[] = [];
    gameRoles.forEach((gameRole) => {
      if (!!gameRole.game) {
      const datum = {
        name: gameRole.game.name,
        role: gameRole.role,
        gameId: gameRole.game.textChannelId,
      };
      games.push(datum);
    }
    });

    return games;
  };

  return <List primaryKey="name" secondaryKey="role" data={transformGames()} onClickItem={(e: any) => {
    history.push(`/game/${e.item.gameId}`, { role: e.item.role})
  }}/>;
};

export default GamesList;
