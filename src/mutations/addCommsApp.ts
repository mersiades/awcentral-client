import { gql } from '@apollo/client';
import { Game } from '../@types';

export interface AddCommsAppData {
  game: Game
}

export interface AddCommsAppVars {
  gameId: string,
  app: string
}

const ADD_COMMS_APP = gql`
  mutation AddCommsApp($gameId: String!, $app: String!) {
    addCommsApp(gameId: $gameId, app: $app) {
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

export default ADD_COMMS_APP