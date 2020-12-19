import { gql } from '@apollo/client';
import { Game } from '../@types';

export interface GamesForInviteeData {
  gamesForInvitee: Game[];
}

export interface GamesForInviteeVars {
  email: string;
}

const GAMES_FOR_INVITEE = gql`
  query GamesForInvitee($email: String!) {
    gamesForInvitee(email: $email) {
      id
      name
      mc {
        displayName
      }
      players {
        displayName
      }
    }
  }
`

export default GAMES_FOR_INVITEE
