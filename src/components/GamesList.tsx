import { FC } from 'react';
import { List } from 'grommet';
import { useHistory } from 'react-router-dom';
import { GameRole } from '../@types/dataInterfaces';
import { RoleType } from '../@types/enums';

interface GamesListProps {
  gameRoles: GameRole[];
}

interface GameInList {
  name: string;
  role: RoleType;
  gameId: string;
  numberOfCharacters: number;
}

const GamesList: FC<GamesListProps> = ({ gameRoles }) => {
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------- Component functions -------------------------------------------------- //
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

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  return (
    <List
      primaryKey="name"
      secondaryKey="role"
      data={transformGames()}
      onClickItem={async (e: any) => {
        if (e.item.role === RoleType.player && e.item.numberOfCharacters === 0) {
          console.log(`/character-creation/${e.item.gameId}?step=0`);
          history.push(`/character-creation/${e.item.gameId}?step=0`);
        } else if (e.item.role === RoleType.player) {
          console.log(`/player-game/${e.item.gameId}`);
          history.push(`/player-game/${e.item.gameId}`);
        } else {
          console.log(`/mc-game/${e.item.gameId}`);
          history.push(`/mc-game/${e.item.gameId}`);
        }
      }}
    />
  );
};

export default GamesList;
