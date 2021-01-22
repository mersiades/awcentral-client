import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformHxRollMoveData {
  performHxRollMove: Game;
}

export interface PerformHxRollMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveId: string;
  targetId: string;
}

const PERFORM_HX_ROLL_MOVE = gql`
  mutation PerformHxRollMove(
    $gameId: String!
    $gameroleId: String!
    $characterId: String!
    $moveId: String!
    $targetId: String!
  ) {
    performHxRollMove(
      gameId: $gameId
      gameroleId: $gameroleId
      characterId: $characterId
      moveId: $moveId
      targetId: $targetId
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
      }
    }
  }
`;

export default PERFORM_HX_ROLL_MOVE;
