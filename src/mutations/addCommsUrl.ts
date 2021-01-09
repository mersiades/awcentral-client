import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface AddCommsUrlData {
  game: Game
}

export interface AddCommsUrlVars {
  gameId: string,
  url: string
}

const ADD_COMMS_URL = gql`
  mutation AddCommsUrl($gameId: String!, $url: String!) {
    addCommsUrl(gameId: $gameId, url: $url) {
      id
      name
      invitees
      commsApp
      commsUrl
      mc {
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
`

export default ADD_COMMS_URL