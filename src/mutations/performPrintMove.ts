import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformPrintMoveData {
  performPrintMove: Game;
}

export interface PerformPrintMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
  moveId: string;
  isGangMove: boolean;
}

const PERFORM_PRINT_MOVE = gql`
  mutation PerformPrintMove(
    $gameId: String!
    $gameRoleId: String!
    $characterId: String!
    $moveId: String!
    $isGangMove: Boolean!
  ) {
    performPrintMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      characterId: $characterId
      moveId: $moveId
      isGangMove: $isGangMove
    ) {
      id
      gameMessages {
        id
        gameId
        gameRoleId
        messageType
        title
        content
        sentOn
      }
    }
  }
`;

export default PERFORM_PRINT_MOVE;
