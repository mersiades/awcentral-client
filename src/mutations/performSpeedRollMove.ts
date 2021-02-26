import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformSpeedRollMoveData {
  performSpeedRollMove: Game;
}

export interface PerformSpeedRollMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
  moveId: string;
  modifier: number;
}

const PERFORM_SPEED_ROLL_MOVE = gql`
  mutation PerformSpeedRollMove(
    $gameId: String!
    $gameRoleId: String!
    $characterId: String!
    $moveId: String!
    $modifier: Int!
  ) {
    performSpeedRollMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      characterId: $characterId
      moveId: $moveId
      modifier: $modifier
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
        additionalModifierValue
        additionalModifierName
      }
    }
  }
`;

export default PERFORM_SPEED_ROLL_MOVE;
