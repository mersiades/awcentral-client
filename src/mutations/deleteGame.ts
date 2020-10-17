import { gql } from '@apollo/client';

const DELETE_GAME = gql`
  mutation DeleteGame($textChannelId: String!) {
    deleteGame(textChannelId: $textChannelId) {
      id
    }
  }
}
`

export default DELETE_GAME