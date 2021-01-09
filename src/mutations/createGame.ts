import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface CreateGameData {
  createGame: Game
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

export default CREATE_GAME