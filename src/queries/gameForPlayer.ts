import { gql } from '@apollo/client';
import { Game } from '../@types';

export interface GameForPlayerData {
  gameForPlayer: Game;
}

export interface GameForPlayerVars {
  textChannelId: string;
  userId: string;
}

const GAME_FOR_PLAYER = gql`
  query GameForPlayer($textChannelId: String!, $userId: String!) {
    gameForPlayer(textChannelId: $textChannelId, userId: $userId) {
      id
      name
      textChannelId
      voiceChannelId
      gameRoles {
        id
        role
        characters {
          id
          name
          playbook
          gear
        }
      }
    }
  }
`

export default GAME_FOR_PLAYER
