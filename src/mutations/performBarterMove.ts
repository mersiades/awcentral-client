import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformBarterMoveData {
  performBarterMove: Game;
}

export interface PerformBarterMoveVars {
  gameId: string;
  gameroleId: string;
  characterId: string;
  moveId: string;
  barter: number;
}

const PERFORM_BARTER_MOVE = gql`
  mutation PerformBarterMove(
    $gameId: String!
    $gameroleId: String!
    $characterId: String!
    $moveId: String!
    $barter: Int!
  ) {
    performBarterMove(
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

export default PERFORM_BARTER_MOVE;
