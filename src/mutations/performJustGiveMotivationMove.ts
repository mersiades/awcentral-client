import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformJustGiveMotivationMoveData {
  performJustGiveMotivationMove: Game;
}

export interface PerformJustGiveMotivationMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
  targetId?: string;
}

const PERFORM_JUST_GIVE_MOTIVATION_MOVE = gql`
  mutation PerformJustGiveMotivationMove($gameId: String!, $gameRoleId: String!, $characterId: String!, $targetId: String) {
    performJustGiveMotivationMove(gameId: $gameId, gameRoleId: $gameRoleId, characterId: $characterId, targetId: $targetId) {
      id
      gameMessages {
        id
        gameId
        gameRoleId
        messageType
        title
        content
        sentOn
        roll1
        roll2
        rollModifier
        rollResult
        modifierStatName
      }
    }
  }
`;

export default PERFORM_JUST_GIVE_MOTIVATION_MOVE;
