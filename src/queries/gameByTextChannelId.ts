import { gql } from '@apollo/client';

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