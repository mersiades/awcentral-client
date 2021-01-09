import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface AddUserToGameData {
  addUserToGame: Game
}

export interface AddUserToGameVars {
  userId: string
  gameId: string
  displayName: string
  email: string
}

const ADD_USER_TO_GAME = gql`
  mutation AddUserToGame($userId: String!, $displayName: String!, $email: String!, $gameId: String!) {
    addUserToGame(userId: $userId, displayName: $displayName, email: $email, gameId: $gameId) {
    id
    name
    mc {
      displayName
    }
    players {
      displayName
    }
    gameRoles {
        id
        role
    }
  }
}
`

export default ADD_USER_TO_GAME