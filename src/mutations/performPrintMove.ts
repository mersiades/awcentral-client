import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformPrintMoveData {
  performPrintMove: Game;
}

export interface PerformPrintMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveId: string;
}

const PERFORM_PRINT_MOVE = gql`
  mutation PerformPrintMove($gameId: String!, $gameroleId: String!, $characterId: String!, $moveId: String!) {
    performPrintMove(gameId: $gameId, gameroleId: $gameroleId, characterId: $characterId, moveId: $moveId) {
      id
      gameMessages {
        id
        gameId
        gameroleId
        messageType
        title
        content
        sentOn
      }
    }
  }
`;

export default PERFORM_PRINT_MOVE;
