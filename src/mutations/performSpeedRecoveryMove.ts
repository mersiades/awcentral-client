import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformSpeedRecoveryMoveData {
  performSpeedRecoveryMove: Game;
}

export interface PerformSpeedRecoveryMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  stockSpent: 0 | 1;
}

const PERFORM_SPEED_RECOVERY_MOVE = gql`
  mutation PerformSpeedRecoveryMove($gameId: String!, $gameroleId: String!, $characterId: String!, $stockSpent: Int!) {
    performSpeedRecoveryMove(gameId: $gameId, gameroleId: $gameroleId, characterId: $characterId, stockSpent: $stockSpent) {
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

export default PERFORM_SPEED_RECOVERY_MOVE;
