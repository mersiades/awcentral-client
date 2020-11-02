import { gql } from '@apollo/client';
import { Game } from '../@types';

export interface GameByTextChannelData {
  gameByTextChannelId: Game
}

export interface GameByTextChannelVars {
  textChannelId: string
}

const GAME_BY_TEXT_CHANNEL_ID = gql`
  query GameByTextChannelId($textChannelId: String!) {
    gameByTextChannelId(textChannelId: $textChannelId) {
      id
      name
      textChannelId
      voiceChannelId
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