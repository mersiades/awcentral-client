import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformStockMoveData {
  performStockMove: Game;
}

export interface PerformStockMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveName: string;
  stockSpent: 0 | 1 | 2;
}

const PERFORM_STOCK_MOVE = gql`
  mutation PerformStockMove(
    $gameId: String!
    $gameroleId: String!
    $characterId: String!
    $moveName: String!
    $stockSpent: Int!
  ) {
    performStockMove(
      gameId: $gameId
      gameroleId: $gameroleId
      characterId: $characterId
      moveName: $moveName
      stockSpent: $stockSpent
    ) {
      id
      gameMessages {
        id
        gameId
        gameroleId
        messageType
        title
        content
        sentOn
        stockSpent
        currentStock
      }
    }
  }
`;

export default PERFORM_STOCK_MOVE;
