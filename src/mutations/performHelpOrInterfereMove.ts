import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformHelpOrInterfereMoveData {
  performHelpOrInterfereMove: Game;
}

export interface PerformHelpOrInterfereMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
  moveId: string;
  targetId: string;
}

const PERFORM_HELP_OR_INTERFERE_MOVE = gql`
  mutation PerformHelpOrInterfereMove(
    $gameId: String!
    $gameRoleId: String!
    $characterId: String!
    $moveId: String!
    $targetId: String!
  ) {
    performHelpOrInterfereMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      characterId: $characterId
      moveId: $moveId
      targetId: $targetId
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
        roll1
        roll2
        rollModifier
        rollResult
        modifierStatName
      }
    }
  }
`;

export default PERFORM_HELP_OR_INTERFERE_MOVE;
