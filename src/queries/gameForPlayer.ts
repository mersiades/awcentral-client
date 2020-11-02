import { gql } from '@apollo/client';

const GAME_FOR_PLAYER = gql`
  query GameForPlayer($textChannelId: String!, $userId: String!) {
    gameForPlayer(textChannelId: $textChannelId, userId: $userId) {
      id
      name
      textChannelId
      voiceChannelId
      gameRoles {
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
