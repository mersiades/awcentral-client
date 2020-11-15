import { gql } from '@apollo/client';
import { GameResponse } from '../@types';

export interface CreateGameData {
  createGame: GameResponse
}

export interface CreateGameVars {
  discordId: string
  name: string
}

const CREATE_GAME = gql`
  mutation CreateGame($discordId: String!, $name: String!) {
    createGame(discordId: $discordId, name: $name) {
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