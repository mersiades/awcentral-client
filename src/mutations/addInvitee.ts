import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface AddInviteeData {
  game: Game
}

export interface AddInviteeVars {
  gameId: string,
  email: string
}

const ADD_INVITEE = gql`
  mutation AddInvitee($gameId: String!, $email: String!) {
    addInvitee(gameId: $gameId, email: $email) {
      id
      name
      invitees
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

export default ADD_INVITEE