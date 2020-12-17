import { gql } from '@apollo/client';
import { Game } from '../@types';

export interface GameData {
  game: Game
}

export interface GameVars {
  gameId: string
}

const GAME_BY_TEXT_CHANNEL_ID = gql`
  query Game($gameId: String!) {
    game(gameId: $gameId) {
      id
      name
      gameRoles {
        role
        npcs {
          id
        }
        threats {
          id
        }
        characters {
          id
          name
        }
      }
  }
}
`;
export default GAME_BY_TEXT_CHANNEL_ID;