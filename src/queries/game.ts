import { gql } from '@apollo/client';
import { Game } from '../@types';

export interface GameData {
  game: Game
}

export interface GameVars {
  gameId: string
}

const GAME = gql`
  query Game($gameId: String!) {
    game(gameId: $gameId) {
      id
      name
      invitees
      users {
        displayName
      }
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
export default GAME;