import { gql } from '@apollo/client';
import { Game } from '../@types';

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