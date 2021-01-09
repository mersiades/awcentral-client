import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface DeleteGameData {
  deleteGame: Game
}

export interface DeleteGameVars {
  gameId: string
}

const DELETE_GAME = gql`
  mutation DeleteGame($gameId: String!) {
    deleteGame(gameId: $gameId) {
      id
    }
  }
`

export default DELETE_GAME