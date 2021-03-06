import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformFortunesMoveData {
  performFortunesMove: Game;
}

export interface PerformFortunesMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
}

const PERFORM_FORTUNES_MOVE = gql`
  mutation PerformFortunesMove($gameId: String!, $gameRoleId: String!, $characterId: String!) {
    performFortunesMove(gameId: $gameId, gameRoleId: $gameRoleId, characterId: $characterId) {
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
        additionalModifierValue
        additionalModifierName
        rollModifier
        modifierStatName
        rollResult
      }
    }
  }
`;

export default PERFORM_FORTUNES_MOVE;
