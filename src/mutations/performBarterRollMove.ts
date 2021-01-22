import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformBarterRollMoveData {
  performBarterRollMove: Game;
}

export interface PerformBarterRollMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveId: string;
  barter: number;
}

const PERFORM_BARTER_ROLL_MOVE = gql`
  mutation PerformBarterRollMove(
    $gameId: String!
    $gameroleId: String!
    $characterId: String!
    $moveId: String!
    $barter: Int!
  ) {
    performBarterRollMove(
      gameId: $gameId
      gameroleId: $gameroleId
      characterId: $characterId
      moveId: $moveId
      barter: $barter
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
        barterSpent
        currentBarter
      }
    }
  }
`;

export default PERFORM_BARTER_ROLL_MOVE;
