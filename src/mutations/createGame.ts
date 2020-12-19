import { gql } from '@apollo/client';
import { GameResponse } from '../@types';

export interface CreateGameData {
  createGame: GameResponse
}

export interface CreateGameVars {
  userId: string
  name: string
  displayName: string
  email: string
}

const CREATE_GAME = gql`
  mutation CreateGame($userId: String!, $name: String!, $displayName: String!, $email: String!) {
    createGame(userId: $userId, name: $name, displayName: $displayName, email: $email) {
    id
    name
    users {
      displayName
    }
    gameRoles {
        id
        role
    }
  }
}
`

export default CREATE_GAME