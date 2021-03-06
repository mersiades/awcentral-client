import { gql } from '@apollo/client';
import { Game } from '../@types/dataInterfaces';

export interface PerformBarterMoveData {
  performBarterMove: Game;
}

export interface PerformBarterMoveVars {
  gameId: string;
  gameRoleId: string;
  characterId: string;
  moveId: string;
  barter: number;
}

const PERFORM_BARTER_MOVE = gql`
  mutation PerformBarterMove(
    $gameId: String!
    $gameRoleId: String!
    $characterId: String!
    $moveId: String!
    $barter: Int!
  ) {
    performBarterMove(
      gameId: $gameId
      gameRoleId: $gameRoleId
      characterId: $characterId
      moveId: $moveId
      barter: $barter
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
        barterSpent
        currentBarter
      }
    }
  }
`;

export default PERFORM_BARTER_MOVE;
