import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformStatRollMoveData {
  performRollMove: Game;
}

export interface PerformStatRollMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
  moveId: string;
  isGangMove: boolean;
}

const PERFORM_STAT_ROLL_MOVE = gql`
  mutation PerformStatRollMove(
    $gameId: String!
    $gameRoleId: String!
    $characterId: String!
    $moveId: String!
    $isGangMove: Boolean!
  ) {
    performStatRollMove(
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
        roll1
        roll2
        rollModifier
        rollResult
        modifierStatName
      }
    }
  }
`;

export default PERFORM_STAT_ROLL_MOVE;
