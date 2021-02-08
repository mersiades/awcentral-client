import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformSpeedRollMoveData {
  performSpeedRollMove: Game;
}

export interface PerformSpeedRollMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveId: string;
  modifier: number;
}

const PERFORM_SPEED_ROLL_MOVE = gql`
  mutation PerformSpeedRollMove(
    $gameId: String!
    $gameroleId: String!
    $characterId: String!
    $moveId: String!
    $modifier: Int!
  ) {
    performSpeedRollMove(
      gameId: $gameId
      gameroleId: $gameroleId
      characterId: $characterId
      moveId: $moveId
      modifier: $modifier
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
