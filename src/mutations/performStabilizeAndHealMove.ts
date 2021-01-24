import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformStabilizeAndHealMoveData {
  performStabilizeAndHealMove: Game;
}

export interface PerformStabilizeAndHealMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  stockSpent: number;
}

const PERFORM_STABILIZE_AND_HEAL_MOVE = gql`
  mutation PerformStabilizeAndHealMove($gameId: String!, $gameroleId: String!, $characterId: String!, $stockSpent: Int!) {
    performStabilizeAndHealMove(
      gameId: $gameId
      gameroleId: $gameroleId
      characterId: $characterId
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
        roll1
        roll2
        rollResult
      }
    }
  }
`;

export default PERFORM_STABILIZE_AND_HEAL_MOVE;
