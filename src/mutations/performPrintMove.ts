import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformPrintMoveData {
  performPrintMove: Game;
}

export interface PerformPrintMoveVars {
  gameId: string;
  characterId: string;
  moveId: string;
}

const PERFORM_PRINT_MOVE = gql`
  mutation PerformPrintMove($gameId: String!, $characterId: String!, $moveId: String!) {
    performPrintMove(gameId: $gameId, characterId: $characterId, moveId: $moveId) {
      id
      gameMessages {
        id
        messageType
        senderName
        content
      }
    }
  }
`;

export default PERFORM_PRINT_MOVE;
