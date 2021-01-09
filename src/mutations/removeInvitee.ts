import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface RemoveInviteeData {
  game: Game
}

export interface RemoveInviteeVars {
  gameId: string,
  email: string
}

const REMOVE_INVITEE = gql`
  mutation RemoveInvitee($gameId: String!, $email: String!) {
    removeInvitee(gameId: $gameId, email: $email) {
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

export default REMOVE_INVITEE