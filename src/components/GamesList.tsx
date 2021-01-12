import { List } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { GameRole } from '../@types/dataInterfaces';
import { Roles } from '../@types/enums';

interface GamesListProps {
  gameRoles: GameRole[];
}

interface GameInList {
  name: string;
  role: Roles;
  gameId: string;
  numberOfCharacters: number;
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
          gameId: gameRole.game.id,
          numberOfCharacters: gameRole.characters ? gameRole.characters.length : 0,
        };
        games.push(datum);
      }
    });

    return games;
  };

  return (
    <List
      primaryKey="name"
      secondaryKey="role"
      data={transformGames()}
      onClickItem={(e: any) => {
        console.log('e.item', e.item);
        if (e.item.role === Roles.player && e.item.numberOfCharacters === 0) {
        } else if (e.item.role === Roles.player) {
          history.push(`/player-game/${e.item.gameId}`);
        } else {
          history.push(`/mc-game/${e.item.gameId}`);
        }
      }}
    />
  );
};

export default GamesList;
