import { gql } from '@apollo/client';
import { GameResponse } from '../@types';

export interface CreateGameData {
  createGame: GameResponse
}

export interface CreateGameVars {
  userId: string
  name: string
}

const CREATE_GAME = gql`
  mutation CreateGame($userId: String!, $name: String!) {
    createGame(userId: $userId, name: $name) {
    id
    name
    gameRoles {
        id
        role
    }
  }
}
`

export default CREATE_GAME