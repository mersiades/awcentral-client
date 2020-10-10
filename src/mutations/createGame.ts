import { gql } from '@apollo/client';

const CREATE_GAME = gql`
  mutation CreateGame($discordId: String!, $name: String!, $textChannelId: String!, $voiceChannelId: String!) {
    createGame(discordId: $discordId, name: $name, textChannelId: $textChannelId, voiceChannelId: $voiceChannelId) {
    id
    name
    textChannelId
    voiceChannelId
    gameRoles {
        id
        role
    }
  }
}
`

export default CREATE_GAME