import { gql } from '@apollo/client';
import { Game } from '../@types';

export interface AddUserToGameData {
  addUserToGame: Game
}

export interface AddUserToGameVars {
  userId: string
  gameId: string
}

const ADD_USER_TO_GAME = gql`
  mutation AddUserToGame($userId: String!, $gameId: String!) {
    addUserToGame(userId: $userId, gameId: $gameId) {
    id
    name
    gameRoles {
        id
        role
    }
  }
}
`

export default ADD_USER_TO_GAME