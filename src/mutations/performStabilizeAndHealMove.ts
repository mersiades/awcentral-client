import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformStabilizeAndHealMoveData {
  performStabilizeAndHealMove: Game;
}

export interface PerformStabilizeAndHealMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
  stockSpent: number;
}

const PERFORM_STABILIZE_AND_HEAL_MOVE = gql`
  mutation PerformStabilizeAndHealMove($gameId: String!, $gameRoleId: String!, $characterId: String!, $stockSpent: Int!) {
    performStabilizeAndHealMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      characterId: $characterId
      stockSpent: $stockSpent
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
